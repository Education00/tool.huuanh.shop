export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Range",
      "Access-Control-Expose-Headers": "Content-Disposition, Content-Length, Content-Range",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const reqUrl = new URL(request.url);
    const origin = reqUrl.origin;

    if (reqUrl.pathname === "/proxy") {
      return handleProxyDownload(request, reqUrl, corsHeaders);
    }

    try {
      let rawInput = "";
      let mode = "auto";

      if (request.method === "POST") {
        const body = await request.json().catch(() => ({}));
        rawInput = (body.url || "").trim();
        mode = (body.mode || "auto").trim();
      } else {
        rawInput = (reqUrl.searchParams.get("url") || "").trim();
        mode = (reqUrl.searchParams.get("mode") || "auto").trim();
      }

      const targetUrl = extractCleanUrl(rawInput);
      if (!targetUrl) {
        return jsonResponse(
          {
            ok: false,
            error: "Không tìm thấy liên kết hợp lệ. Hãy dán link TikTok hoặc YouTube.",
          },
          400,
          corsHeaders
        );
      }

      const isYouTube =
        /youtube\.com|youtu\.be/i.test(targetUrl) || mode === "yt";

      const result = isYouTube
        ? await extractYouTube(targetUrl, origin, env)
        : await extractTikTok(targetUrl, mode, origin);

      return jsonResponse(result, 200, corsHeaders);
    } catch (err) {
      return jsonResponse(
        {
          ok: false,
          error: err.message || "Không thể bóc tách liên kết này, vui lòng thử lại.",
        },
        500,
        corsHeaders
      );
    }
  },
};

function extractCleanUrl(text) {
  if (!text) return "";
  const match = String(text).match(/https?:\/\/[^\s"'<>]+/i);
  return match ? match[0] : "";
}

function normalizeTikwmUrl(u) {
  if (!u || typeof u !== "string") return "";
  if (u.startsWith("//")) return "https:" + u;
  if (u.startsWith("/")) return "https://www.tikwm.com" + u;
  return u;
}

function jsonResponse(data, status, corsHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function buildProxyUrl(origin, mediaUrl, filename) {
  if (!mediaUrl) return "";
  const u = new URL("/proxy", origin);
  u.searchParams.set("url", mediaUrl);
  if (filename) u.searchParams.set("name", filename);
  return u.toString();
}

async function handleProxyDownload(request, reqUrl, corsHeaders) {
  const mediaUrl = reqUrl.searchParams.get("url");
  const filename = (reqUrl.searchParams.get("name") || "huuanh-media.mp4").replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  );

  if (!mediaUrl) {
    return new Response("Missing url parameter", { status: 400, headers: corsHeaders });
  }

  let parsed;
  try {
    parsed = new URL(mediaUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Invalid protocol");
    }
  } catch {
    return new Response("Invalid url", { status: 400, headers: corsHeaders });
  }

  const reqHeaders = {
    "User-Agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
    Referer: parsed.origin + "/",
  };
  const range = request.headers.get("Range");
  if (range) reqHeaders["Range"] = range;

  const upstream = await fetch(parsed.toString(), {
    headers: reqHeaders,
    redirect: "follow",
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new Response(`Upstream error: ${upstream.status}`, {
      status: upstream.status,
      headers: corsHeaders,
    });
  }

  const contentType =
    upstream.headers.get("content-type") || "application/octet-stream";
  const contentLength = upstream.headers.get("content-length");
  const contentRange = upstream.headers.get("content-range");

  const headers = new Headers(corsHeaders);
  headers.set("Content-Type", contentType);
  headers.set("Content-Disposition", `attachment; filename="${filename}"`);
  if (contentLength) headers.set("Content-Length", contentLength);
  if (contentRange) headers.set("Content-Range", contentRange);

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}

async function resolveShortUrl(rawUrl) {
  try {
    const res = await fetch(rawUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
      },
    });
    return res.url || rawUrl;
  } catch {
    return rawUrl;
  }
}

function formatDuration(sec) {
  const s = Math.max(0, Number(sec) || 0);
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function formatBytes(bytes) {
  const b = Number(bytes) || 0;
  if (!b) return "";
  if (b >= 1024 * 1024) return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(b / 1024)} KB`;
}

async function extractTikTok(rawUrl, mode, origin) {
  const fullUrl = await resolveShortUrl(rawUrl);
  let commentId = "";
  let awemeId = "";

  try {
    const u = new URL(fullUrl);
    commentId =
      u.searchParams.get("comment_id") ||
      u.searchParams.get("share_comment_id") ||
      u.searchParams.get("cid") ||
      "";
    const m = u.pathname.match(/\/(?:video|photo|story|v)\/(\d+)/i);
    if (m) awemeId = m[1];
    if (!awemeId) {
      const itemParam = u.searchParams.get("item_id") || u.searchParams.get("share_item_id");
      if (itemParam && /^\d+$/.test(itemParam)) awemeId = itemParam;
    }
  } catch {}

  if ((commentId || mode === "tt_cmt") && awemeId && commentId) {
    const cmtResult = await extractTikTokComment(
      fullUrl,
      awemeId,
      commentId,
      origin
    );
    if (cmtResult) return cmtResult;
  }

  const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(fullUrl)}&hd=1`;
  const res = await fetch(apiUrl, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
  });

  const json = await res.json();
  if (!json || json.code !== 0 || !json.data) {
    throw new Error(json?.msg || "Không tìm thấy dữ liệu media từ liên kết TikTok này");
  }

  const d = json.data;
  const id = d.id || awemeId || Date.now();
  const authorHandle = d.author?.unique_id ? `@${d.author.unique_id}` : "@tiktok";
  const authorName = d.author?.nickname
    ? `${authorHandle} · ${d.author.nickname}`
    : authorHandle;
  const title = d.title || `Media của ${authorHandle}`;
  const thumb = normalizeTikwmUrl(d.origin_cover || d.cover || "");
  const musicUrl = normalizeTikwmUrl(d.music || d.music_info?.play || "");

  if (Array.isArray(d.images) && d.images.length > 0) {
    const slides = d.images.map((rawImg, idx) => {
      const imgUrl = normalizeTikwmUrl(rawImg);
      return {
        idx: idx + 1,
        name: `Ảnh ${String(idx + 1).padStart(2, "0")}`,
        res: "Gốc",
        c: idx % 2 === 0 ? "#FFD85E" : "#F0C23C",
        img: imgUrl,
        url: buildProxyUrl(origin, imgUrl, `huuanh-slide-${id}-${idx + 1}.jpg`),
      };
    });

    const downloads = [
      {
        id: "slide_sel",
        label: "Tải các ảnh đã chọn (Không logo)",
        sub: "JPG chất lượng gốc · Không chèn chữ TikTok",
        tag: "Tải ảnh",
        pri: true,
        ext: "jpg",
        url: slides[0]?.url || "",
      },
      {
        id: "slide_all",
        label: `Tải trọn bộ tất cả ${slides.length} ảnh`,
        sub: "Lưu toàn bộ album ảnh độ phân giải cao",
        tag: `${slides.length} ảnh`,
        pri: false,
        ext: "jpg",
        url: slides[0]?.url || "",
      },
    ];

    if (musicUrl) {
      downloads.push({
        id: "slide_mp3",
        label: "Tải Nhạc nền của Slide ảnh",
        sub: `MP3 · ${d.music_info?.title || "Âm thanh gốc"}`,
        tag: "MP3",
        pri: false,
        ext: "mp3",
        url: buildProxyUrl(origin, musicUrl, `huuanh-audio-${id}.mp3`),
      });
    }

    return {
      ok: true,
      kind: "tt_slide",
      badge: "Slide Ảnh & Nhạc TikTok",
      url: rawUrl,
      title,
      author: `${authorName} · ${slides.length} ảnh`,
      dur: `${slides.length} ảnh`,
      thumb: slides[0]?.img || thumb,
      stats: ["Ảnh gốc không logo", `${slides.length} tấm`, "Kèm nhạc MP3"],
      color: "#303030",
      slides,
      downloads,
    };
  }

  const isStory =
    mode === "tt_story" ||
    /\/story\//i.test(fullUrl) ||
    (Number(d.duration) <= 15 && /story/i.test(d.title || ""));

  const hdUrl = normalizeTikwmUrl(d.hdplay || d.play || "");
  const nwmUrl = normalizeTikwmUrl(d.play || d.hdplay || "");
  const wmUrl = normalizeTikwmUrl(d.wmplay || "");
  const hdSize = formatBytes(d.hd_size) || formatBytes(d.size) || "HD";
  const nwmSize = formatBytes(d.size) || "MP4";

  const downloads = [];
  if (hdUrl) {
    downloads.push({
      id: "nwm_hd",
      label: isStory
        ? "Tải Nhật ký Video (Không logo)"
        : "Tải Video HD (Không dính logo)",
      sub: "MP4 · Độ phân giải gốc · Đã gỡ watermark",
      tag: hdSize,
      pri: true,
      ext: "mp4",
      url: buildProxyUrl(origin, hdUrl, `huuanh-${id}-hd.mp4`),
    });
  }
  if (nwmUrl && nwmUrl !== hdUrl) {
    downloads.push({
      id: "src_max",
      label: "Tải Video Tiêu chuẩn (Không logo)",
      sub: "MP4 · Tối ưu dung lượng & tốc độ",
      tag: nwmSize,
      pri: false,
      ext: "mp4",
      url: buildProxyUrl(origin, nwmUrl, `huuanh-${id}.mp4`),
    });
  } else if (wmUrl) {
    downloads.push({
      id: "src_max",
      label: "Tải Video Nguồn (Có logo)",
      sub: "MP4 · Bản gốc từ máy chủ",
      tag: formatBytes(d.wm_size) || "MP4",
      pri: false,
      ext: "mp4",
      url: buildProxyUrl(origin, wmUrl, `huuanh-${id}-wm.mp4`),
    });
  }
  if (musicUrl) {
    downloads.push({
      id: "mp3",
      label: "Tải Nhạc nền / Âm thanh riêng",
      sub: `MP3 · ${d.music_info?.title || "Nhạc nền gốc"}`,
      tag: "MP3",
      pri: false,
      ext: "mp3",
      url: buildProxyUrl(origin, musicUrl, `huuanh-${id}.mp3`),
    });
  }
  if (thumb) {
    downloads.push({
      id: "cover",
      label: "Tải Ảnh bìa Video (Thumbnail)",
      sub: "JPG · Độ phân giải gốc",
      tag: "JPG",
      pri: false,
      ext: "jpg",
      url: buildProxyUrl(origin, thumb, `huuanh-${id}-cover.jpg`),
    });
  }

  return {
    ok: true,
    kind: isStory ? "tt_story" : "tt_vid",
    badge: isStory ? "Nhật ký TikTok (Story 24h)" : "TikTok Video · Không logo",
    url: rawUrl,
    title,
    author: authorName,
    dur: formatDuration(d.duration),
    thumb,
    stats: [
      isStory ? "Story Không Logo" : "Không Logo",
      hdSize,
      `♥ ${d.digg_count || 0}`,
    ],
    color: isStory ? "#F0C23C" : "#FFD85E",
    downloads,
  };
}

async function extractTikTokComment(fullUrl, awemeId, commentId, origin) {
  try {
    const api = `https://www.tiktok.com/api/comment/list/?aweme_id=${awemeId}&cursor=0&count=50&aid=1988&insert_ids=${encodeURIComponent(
      commentId
    )}`;
    const res = await fetch(api, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
        Referer: fullUrl,
      },
    });
    const data = await res.json();
    const comments = data?.comments || [];
    const cmt =
      comments.find((c) => String(c.cid) === String(commentId)) ||
      comments.find((c) => c.image_list || c.sticker);

    if (!cmt) return null;

    const user = cmt.user?.unique_id
      ? `@${cmt.user.unique_id}`
      : cmt.user?.nickname || "@user";
    const text = cmt.text || "Bình luận đính kèm media";
    const downloads = [];
    let thumb = "";

    if (Array.isArray(cmt.image_list) && cmt.image_list.length > 0) {
      const imgObj = cmt.image_list[0];
      const staticUrl =
        imgObj.origin_url?.url_list?.[0] ||
        imgObj.crop_url?.url_list?.[0] ||
        "";
      const liveVideoUrl =
        imgObj.live_photo_vid_url?.url_list?.[0] || "";
      thumb = staticUrl;

      if (liveVideoUrl) {
        downloads.push({
          id: "cmt_live",
          label: "Tải Live Photo gốc (Video chuyển động .MOV)",
          sub: "Giữ nguyên chuyển động từ bình luận",
          tag: "LIVE .MOV",
          pri: true,
          ext: "mov",
          url: buildProxyUrl(
            origin,
            liveVideoUrl,
            `huuanh-cmt-live-${commentId}.mov`
          ),
        });
      }
      if (staticUrl) {
        downloads.push({
          id: "cmt_img",
          label: "Tải Ảnh tĩnh trong bình luận",
          sub: "Ảnh gốc không đóng dấu",
          tag: "JPG/PNG",
          pri: !liveVideoUrl,
          ext: "jpg",
          url: buildProxyUrl(
            origin,
            staticUrl,
            `huuanh-cmt-img-${commentId}.jpg`
          ),
        });
      }
    }

    if (cmt.sticker) {
      const stickerUrl =
        cmt.sticker.animate_url?.url_list?.[0] ||
        cmt.sticker.static_url?.url_list?.[0] ||
        "";
      if (!thumb) thumb = stickerUrl;
      if (stickerUrl) {
        downloads.push({
          id: "cmt_sticker",
          label: "Tải Nhãn dán (Sticker động không nền)",
          sub: "GIF / WEBP trong suốt · Không dính viền",
          tag: "Sticker",
          pri: downloads.length === 0,
          ext: "gif",
          url: buildProxyUrl(
            origin,
            stickerUrl,
            `huuanh-sticker-${commentId}.gif`
          ),
        });
      }
    }

    if (!downloads.length) return null;

    return {
      ok: true,
      kind: "tt_cmt",
      badge: "Bình luận TikTok · Sticker & Live Photo",
      url: fullUrl,
      title: `Bình luận của ${user}: “${text}”`,
      author: `${user} · Bình luận đính kèm media`,
      dur: "Comment",
      thumb,
      stats: ["Không dính logo", "Bình luận gốc"],
      color: "#000000",
      downloads,
    };
  } catch {
    return null;
  }
}

function parseYouTubeId(rawUrl) {
  try {
    const u = new URL(rawUrl);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1).split("/")[0];
    }
    if (u.searchParams.get("v")) {
      return u.searchParams.get("v");
    }
    const m = u.pathname.match(/\/(?:shorts|embed|v)\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
  } catch {}
  return "";
}

async function extractYouTube(rawUrl, origin, env) {
  const vid = parseYouTubeId(rawUrl);
  if (!vid) {
    throw new Error("Không nhận diện được ID video YouTube từ liên kết này");
  }

  let title = `YouTube Video (${vid})`;
  let author = "YouTube Channel";
  const thumb = `https://i.ytimg.com/vi/${vid}/maxresdefault.jpg`;

  try {
    const oembedRes = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${vid}`
      )}&format=json`
    );
    if (oembedRes.ok) {
      const oe = await oembedRes.json();
      if (oe.title) title = oe.title;
      if (oe.author_name) author = `${oe.author_name} · YouTube`;
    }
  } catch {}

  const cobaltEndpoint =
    (env && env.COBALT_API_URL) || "https://api.cobalt.tools/";
  let video1080Url = "";
  let audioMp3Url = "";

  try {
    const vRes = await fetch(cobaltEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${vid}`,
        videoQuality: "1080",
        youtubeVideoCodec: "h264",
      }),
    });
    if (vRes.ok) {
      const vData = await vRes.json();
      if (vData?.url) video1080Url = vData.url;
    }

    const aRes = await fetch(cobaltEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${vid}`,
        downloadMode: "audio",
        audioFormat: "mp3",
        audioBitrate: "320",
      }),
    });
    if (aRes.ok) {
      const aData = await aRes.json();
      if (aData?.url) audioMp3Url = aData.url;
    }
  } catch {}

  if (!video1080Url) {
    const pipedInstances = [
      "https://pipedapi.kavin.rocks",
      "https://pipedapi.tokhmi.xyz",
    ];
    for (const inst of pipedInstances) {
      try {
        const pRes = await fetch(`${inst}/streams/${vid}`);
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData.title) title = pData.title;
          if (pData.uploader) author = `${pData.uploader} · YouTube`;
          const vStream = (pData.videoStreams || []).find(
            (s) => !s.videoOnly && s.format === "MPEG_4"
          );
          const aStream = (pData.audioStreams || [])[0];
          if (vStream?.url) video1080Url = vStream.url;
          if (aStream?.url && !audioMp3Url) audioMp3Url = aStream.url;
          if (video1080Url) break;
        }
      } catch {}
    }
  }

  const downloads = [];
  if (video1080Url) {
    downloads.push({
      id: "yt_1080",
      label: "Tải Video Full HD (MP4)",
      sub: "H.264 + AAC · Tương thích mọi thiết bị",
      tag: "MP4 HD",
      pri: true,
      ext: "mp4",
      url: video1080Url,
    });
  }
  if (audioMp3Url) {
    downloads.push({
      id: "yt_mp3",
      label: "Tải Âm thanh / Nhạc MP3 (320kbps)",
      sub: "Tách âm thanh chất lượng cao",
      tag: "MP3",
      pri: !video1080Url,
      ext: "mp3",
      url: audioMp3Url,
    });
  }
  downloads.push({
    id: "yt_thumb",
    label: "Tải Ảnh bìa YouTube (MaxRes 4K)",
    sub: "JPG · 1920×1080",
    tag: "JPG 4K",
    pri: downloads.length === 0,
    ext: "jpg",
    url: buildProxyUrl(origin, thumb, `huuanh-yt-${vid}-thumb.jpg`),
  });

  return {
    ok: true,
    kind: "yt",
    badge: "YouTube Video & Shorts",
    url: rawUrl,
    title,
    author,
    dur: "YouTube",
    thumb,
    stats: ["Full HD / 4K", "MP4 / MP3", vid],
    color: "#FFD85E",
    downloads,
  };
}
