// Cloudflare Worker gộp chung cả Giao diện (HTML) và API Backend trên cùng domain
const HTML_CONTENT = '<!DOCTYPE html>\n<html lang="vi">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<title>huuanh tool – Tải Video, Ảnh, Nhạc, Nhật ký & Bình luận</title>\n<meta name="description" content="Công cụ tải xuống video TikTok không logo, Nhật ký (Story), Slide ảnh, Nhạc MP3, Nhãn dán & Live Photo từ bình luận TikTok và video YouTube.">\n<meta name="robots" content="index, follow">\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link href="https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">\n<style>\n:root{--bg:#F6F6F4;--ink:#000000;--muted:#5E5E5A;--accent:#FFD85E;--hot:#FFD85E;--soft:#FBEDB9;--card:#fff;--line:#E4E4DF;--hl:rgba(255,255,255,.65);--glass:rgba(246,246,244,.6);\nbox-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);color-scheme:light}\nhtml.dark{--bg:#141414;--ink:#F6F6F4;--muted:#A5A5A0;--soft:#2B2614;--card:#1E1E1E;--line:#333330;--hl:rgba(255,255,255,.07);--glass:rgba(20,20,20,.6);color-scheme:dark}\n*,*::before,*::after{box-sizing:border-box}\nhtml{scroll-behavior:smooth}\nbody{margin:0;background:var(--bg);color:var(--ink);font:400 1rem/1.6 Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased;transition:background-color .2s,color .2s}\n.wrap{max-width:640px;margin:0 auto;padding:68px 20px 140px}\nh1,h2,h3{font-family:Lora,Georgia,serif;font-weight:700;line-height:1.2;margin:0}\na,button,input,select{font:inherit;color:inherit}\n:focus-visible{outline:3px solid var(--ink);outline-offset:2px}\n.topbar{position:fixed;top:0;left:0;right:0;height:calc(60px + env(safe-area-inset-top,0px));background:var(--glass);-webkit-backdrop-filter:blur(20px) saturate(170%);backdrop-filter:blur(20px) saturate(170%);border-bottom:1px solid var(--line);z-index:8}\n.brand{position:fixed;top:calc(10px + env(safe-area-inset-top,0px));left:22px;height:40px;display:flex;align-items:center;gap:8px;z-index:9;font:700 1.25rem Lora,Georgia,serif;letter-spacing:-.02em;color:var(--ink);text-decoration:none}\n.brand>svg{width:28px;height:28px}\n.brand:active{transform:scale(.96);opacity:.7}\nhtml.dark .brand>svg{filter:brightness(1.35)}\n.btxt{display:inline-flex;align-items:center}.bdg-sub{width:40px;height:17px;margin-left:5px;transform:translateY(-3px) rotate(-6deg);transform-origin:center;filter:drop-shadow(0 2px 4px rgba(43,112,251,.24));flex:none}\n.actions{position:fixed;top:calc(10px + env(safe-area-inset-top,0px));right:16px;height:40px;display:flex;align-items:center;gap:4px;z-index:9}\n.menu-btn{position:relative;width:40px;height:40px;border:0;background:none;padding:0;display:grid;place-content:center;gap:6px;z-index:9;cursor:pointer;color:var(--muted)}\n.menu-btn i{display:block;width:22px;height:1.5px;border-radius:2px;background:currentColor;transition:transform .3s,opacity .2s}\n.menu-btn[aria-expanded="true"] i:nth-child(1){transform:translateY(7.5px) rotate(45deg)}\n.menu-btn[aria-expanded="true"] i:nth-child(2){opacity:0}\n.menu-btn[aria-expanded="true"] i:nth-child(3){transform:translateY(-7.5px) rotate(-45deg)}\n.tabs a,.srch,.menu-btn,.sheet a,.sheet button,.brand,.seg button,.tgl,.dl-btn{touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}\n.glass{position:relative;background:rgba(255,255,255,.74);-webkit-backdrop-filter:blur(24px) saturate(180%);backdrop-filter:blur(24px) saturate(180%);border:1px solid rgba(255,255,255,.75);box-shadow:0 10px 30px rgba(38,34,29,.16),inset 0 1px 0 rgba(255,255,255,.95),inset 0 -1px 0 rgba(255,255,255,.35);border-radius:999px}\nhtml.dark .glass{background:rgba(44,44,44,.72);border-color:rgba(255,255,255,.16);box-shadow:0 10px 30px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.22),inset 0 -1px 0 rgba(255,255,255,.05)}\n.sheet{position:fixed;top:calc(58px + env(safe-area-inset-top,0px));right:14px;left:14px;max-width:280px;margin-left:auto;border-radius:24px;padding:10px;z-index:9;display:grid;gap:2px;transform-origin:top right;transform:scale(.92);opacity:0;visibility:hidden;pointer-events:none;transition:transform .35s cubic-bezier(.3,1.3,.5,1),opacity .2s,visibility .2s}\n.sheet.open{transform:none;opacity:1;visibility:visible;pointer-events:auto}\n.sheet a,.sheet button{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;border-radius:14px;text-decoration:none;font-size:.95rem;font-weight:500;border:0;background:none;color:var(--ink);width:100%;text-align:left;cursor:pointer;transition:background-color .12s}\n.sheet a.active,.sheet a:focus-visible,.sheet button.active,.sheet button:focus-visible{background:rgba(120,120,128,.16)}\nhtml.dark .sheet a.active,html.dark .sheet a:focus-visible,html.dark .sheet button.active,html.dark .sheet button:focus-visible{background:rgba(255,255,255,.14)}\n.sheet small{color:var(--muted);font-size:.8rem;font-weight:400}\n.sheet hr{border:0;border-top:1px solid var(--line);margin:6px 8px;width:calc(100% - 16px)}\n.mh{margin:6px 16px 2px;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}\n.dock{position:fixed;left:0;right:0;bottom:calc(10px + env(safe-area-inset-bottom,0px));display:flex;gap:10px;justify-content:center;padding:0 14px;z-index:8;pointer-events:none;transition:opacity .2s,transform .2s}\n.dock>*{pointer-events:auto}\n.tabs{display:flex;padding:5px;flex:1;max-width:360px}\n.tabs a{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 0;line-height:1.1;text-decoration:none;font-size:.68rem;font-weight:500;color:var(--ink);border-radius:999px;transition:color .12s}\n.tabs a[aria-current="page"]{color:var(--ink);font-weight:600}\n.tabs a .i-fil{display:none}\n.tabs a[aria-current="page"] .i-out{display:none}\n.tabs a[aria-current="page"] .i-fil{display:block}\n.ind{position:absolute;top:0;left:0;width:0;height:0;border-radius:999px;background:rgba(120,120,128,.16);box-shadow:none;transition:transform .28s cubic-bezier(.4,0,.2,1),width .28s,height .28s}\nhtml.dark .ind{background:rgba(255,255,255,.14)}\n#badge{position:absolute;top:2px;left:calc(50% + 4px);background:var(--hot);color:#000;font-size:.62rem;line-height:1;padding:3px 5px;border-radius:99px;min-width:16px;text-align:center}\n.view[hidden]{display:none}\n.top{text-align:center;padding:10px 0 18px}\nh1{font-size:clamp(2rem,8.5vw,2.75rem);line-height:1.1}\n.tag{color:var(--muted);margin:10px auto 0;font:400 1.02rem/1.5 Lora,Georgia,serif;max-width:36ch}\nh2{font-size:1.35rem;margin:28px 0 12px}\n.tbox{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:16px;box-shadow:0 10px 30px rgba(0,0,0,.04);margin-bottom:16px}\n.url-w{display:flex;gap:8px;align-items:center;background:var(--bg);border:1.5px solid var(--line);border-radius:16px;padding:6px 6px 6px 14px;transition:border-color .15s}\n.url-w:focus-within{border-color:var(--ink)}\n.url-in{flex:1;min-width:0;border:0;background:none;font-size:.96rem;padding:8px 0;outline:none}\n.ibtn{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:11px;padding:8px 12px;font-size:.84rem;font-weight:500;cursor:pointer;white-space:nowrap}\n.ibtn:hover{border-color:var(--ink)}\n.go-btn{width:100%;height:50px;margin-top:12px;border:0;border-radius:14px;background:var(--ink);color:var(--bg);font:600 .98rem Inter,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px}\n.go-btn:active{opacity:.85}\n.go-btn:disabled{opacity:.45;cursor:default}\n.spin{display:none;width:16px;height:16px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:sp .7s linear infinite}\n.go-btn.busy .spin{display:inline-block}\n@keyframes sp{to{transform:rotate(360deg)}}\n.rcard{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:18px;margin-bottom:22px;animation:rise .35s cubic-bezier(.2,.8,.2,1)}\n@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n.rhead{display:flex;gap:14px;align-items:flex-start;margin-bottom:14px}\n.rth{width:96px;height:96px;border-radius:14px;overflow:hidden;flex:none;background:var(--bg);border:1px solid var(--line);position:relative}\n.rth svg,.rth img,.sitem .sth img,.hrow .hth img{width:100%;height:100%;display:block;object-fit:cover}\n.rdur{position:absolute;bottom:6px;right:6px;background:rgba(0,0,0,.78);color:#fff;font-size:.7rem;font-weight:600;padding:1px 6px;border-radius:6px}\n.rmeta{flex:1;min-width:0}\n.rbdg{display:inline-flex;align-items:center;gap:5px;background:var(--soft);color:var(--ink);border:1px solid var(--line);font-size:.74rem;font-weight:600;padding:2px 9px;border-radius:99px;margin-bottom:6px}\n.rbdg i{width:6px;height:6px;border-radius:50%;background:var(--ink)}\n.rmeta h3{font-size:1.05rem;margin-bottom:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}\n.rauthor{font-size:.84rem;color:var(--muted);margin-bottom:4px}\n.rstats{display:flex;gap:8px;flex-wrap:wrap;font-size:.76rem;color:var(--muted)}\n.rstats span{border:1px solid var(--line);padding:1px 8px;border-radius:99px}\n.sgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:12px 0 14px}\n@media (min-width:480px){.sgrid{grid-template-columns:repeat(3,1fr)}}\n.sitem{position:relative;border:1.5px solid var(--line);border-radius:14px;overflow:hidden;background:var(--bg);cursor:pointer}\n.sitem.sel{border-color:var(--ink)}\n.sitem .sth{height:104px;display:block}\n.sitem .sth svg{width:100%;height:100%;display:block}\n.sitem .sbar{display:flex;justify-content:space-between;align-items:center;padding:6px 10px;font-size:.78rem;background:var(--card)}\n.schk{width:18px;height:18px;border-radius:5px;border:1.5px solid var(--line);display:grid;place-items:center;font-size:.7rem;font-weight:700}\n.sitem.sel .schk{background:var(--accent);border-color:var(--ink);color:#000}\n.dl-list{display:grid;gap:8px;margin-top:12px}\n.dl-btn{display:flex;justify-content:space-between;align-items:center;width:100%;padding:12px 16px;border-radius:14px;border:1.5px solid var(--line);background:var(--bg);color:var(--ink);font-weight:500;font-size:.92rem;cursor:pointer;text-align:left;transition:transform .12s,border-color .15s}\n.dl-btn:hover{border-color:var(--ink)}\n.dl-btn:active{transform:scale(.99)}\n.dl-btn.pri{background:var(--accent);border-color:var(--ink);color:#000;font-weight:600}\n.dl-btn small{font-weight:400;font-size:.78rem;opacity:.8;display:block}\n.dl-tag{font-size:.75rem;font-weight:600;padding:3px 9px;border-radius:99px;border:1px solid currentColor}\n.fgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}\n.fcard{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px}\n.fcard b{display:block;font-size:.95rem;margin-bottom:4px}\n.fcard span{display:block;color:var(--muted);font-size:.82rem;line-height:1.45}\n.list{display:grid;gap:10px;list-style:none;margin:0;padding:0}\n.hrow{display:flex;gap:12px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:12px}\n.hrow .hth{width:56px;height:56px;border-radius:10px;overflow:hidden;flex:none}\n.hrow .hth svg{width:100%;height:100%;display:block}\n.hrow .htx{flex:1;min-width:0}\n.hrow b{display:block;font-size:.94rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.hrow small{display:block;color:var(--muted);font-size:.8rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.hacts{display:flex;gap:6px}\n.hacts button{border:1px solid var(--line);background:var(--bg);border-radius:10px;padding:6px 10px;font-size:.8rem;cursor:pointer}\n.empty{text-align:center;color:var(--muted);padding:28px 0}\n.scard{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:6px 16px;margin-bottom:14px}\n.srow{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--line)}\n.srow:last-child{border-bottom:0}\n.srow.col{flex-direction:column;align-items:stretch;gap:10px}\n.slb b{display:block;font-weight:500;font-size:.96rem}\n.slb small{display:block;color:var(--muted);font-size:.82rem;margin-top:2px}\n.seg{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;background:var(--bg);border:1px solid var(--line);padding:4px;border-radius:14px}\n.seg button{border:0;background:none;color:var(--muted);padding:8px 10px;border-radius:10px;font-size:.85rem;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px}\n.seg button[aria-pressed="true"]{background:var(--card);color:var(--ink);font-weight:600;box-shadow:0 2px 6px rgba(0,0,0,.08)}\n.tgl{position:relative;width:56px;height:26px;border-radius:99px;border:0;background:#C7C7CC;cursor:pointer;padding:0;flex:none;transition:background-color .25s cubic-bezier(.4,0,.2,1)}\nhtml.dark .tgl{background:#39393D}\n.tgl i{position:absolute;top:2px;left:2px;width:32px;height:22px;border-radius:99px;background:#fff;box-shadow:0 2px 5px rgba(0,0,0,.18),0 0 1px rgba(0,0,0,.08);transition:transform .25s cubic-bezier(.3,1.15,.5,1)}\n.tgl[aria-checked="true"]{background:#34C759}\nhtml.dark .tgl[aria-checked="true"]{background:#30D158}\n.tgl[aria-checked="true"] i{transform:translateX(20px);background:#fff}\n.arow{display:flex;justify-content:space-between;align-items:center;gap:12px;width:100%;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px 16px;margin-bottom:10px;font:inherit;color:var(--ink);cursor:pointer;text-align:left}\n.arow small{display:block;color:var(--muted);font-size:.82rem;margin-top:2px}\n.fi{width:100%;height:46px;padding:0 14px;border-radius:12px;border:1px solid var(--line);background:var(--bg);color:var(--ink);font-size:.9rem}\n.item{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px;margin-bottom:10px}\n.item h3{font-size:1.02rem;margin-bottom:6px}\n.item p,.item ol{margin:0;color:var(--muted);font-size:.9rem}\n.item ol{padding-left:18px;display:grid;gap:4px}\n.ft{text-align:left;font-size:.92rem;margin-top:48px;padding-top:24px;border-top:1px solid var(--line);color:var(--muted);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}\n.ft a{color:var(--ink);text-decoration:none;font-weight:500}\n#toast{position:fixed;left:50%;bottom:calc(96px + env(safe-area-inset-bottom,0px));transform:translate(-50%,240px);background:var(--ink);color:var(--bg);padding:10px 18px;border-radius:10px;transition:transform .3s;z-index:40;font-size:.9rem}\n#toast.show{transform:translate(-50%,0)}\nbody.rm *,body.rm *::before,body.rm *::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}\n</style>\n</head>\n<body ontouchstart="">\n<div class="topbar" aria-hidden="true"></div>\n<a class="brand" href="#dl" id="brand" aria-label="huuanh tool, về đầu trang">\n  <svg viewBox="-128 -128 256 256" width="28" height="28" aria-hidden="true"><g id="lg"><path d="M0-21C27-45 27-100 0-124C-27-100-27-45 0-21Z" fill="#82cffd"/><path d="M0-21C27-45 27-100 0-124C-27-100-27-45 0-21Z" fill="#4daefd" transform="rotate(45)"/><path d="M0-21C27-45 27-100 0-124C-27-100-27-45 0-21Z" fill="#2b70fb" transform="rotate(90)"/><path d="M0-21C27-45 27-100 0-124C-27-100-27-45 0-21Z" fill="#2050fc" transform="rotate(135)"/><path d="M0-21C27-45 27-100 0-124C-27-100-27-45 0-21Z" fill="#0226c2" transform="rotate(180)"/><path d="M0-21C27-45 27-100 0-124C-27-100-27-45 0-21Z" fill="#001896" transform="rotate(225)"/><path d="M0-21C27-45 27-100 0-124C-27-100-27-45 0-21Z" fill="#02186d" transform="rotate(270)"/><path d="M0-21C27-45 27-100 0-124C-27-100-27-45 0-21Z" fill="#bfeafb" transform="rotate(315)"/></g></svg>\n  <span class="btxt">huuanh<svg class="bdg-sub" viewBox="0 0 42 18" aria-label="tool"><defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="50%" stop-color="#2b70fb"/><stop offset="100%" stop-color="#6366f1"/></linearGradient></defs><rect width="42" height="18" rx="9" fill="url(#tg)"/><path d="M12.41 5.38L12.41 7.09L14.40 7.09L14.40 8.46L12.41 8.46L12.41 11.01Q12.41 11.43 12.58 11.58Q12.75 11.73 13.24 11.73L14.23 11.73L14.23 13.10L12.58 13.10Q11.44 13.10 10.97 12.63Q10.49 12.15 10.49 11.01L10.49 8.46L9.53 8.46L9.53 7.09L10.49 7.09L10.49 5.38L12.41 5.38ZM18.44 8.32Q17.80 8.32 17.46 8.77Q17.13 9.23 17.13 10.10Q17.13 10.96 17.46 11.42Q17.80 11.88 18.44 11.88Q19.06 11.88 19.40 11.42Q19.73 10.96 19.73 10.10Q19.73 9.23 19.40 8.77Q19.06 8.32 18.44 8.32ZM18.44 6.94Q19.99 6.94 20.86 7.78Q21.73 8.62 21.73 10.10Q21.73 11.58 20.86 12.42Q19.99 13.26 18.44 13.26Q16.88 13.26 16.00 12.42Q15.12 11.58 15.12 10.10Q15.12 8.62 16.00 7.78Q16.88 6.94 18.44 6.94ZM25.99 8.32Q25.35 8.32 25.02 8.77Q24.68 9.23 24.68 10.10Q24.68 10.96 25.02 11.42Q25.35 11.88 25.99 11.88Q26.62 11.88 26.95 11.42Q27.29 10.96 27.29 10.10Q27.29 9.23 26.95 8.77Q26.62 8.32 25.99 8.32ZM25.99 6.94Q27.54 6.94 28.42 7.78Q29.29 8.62 29.29 10.10Q29.29 11.58 28.42 12.42Q27.54 13.26 25.99 13.26Q24.44 13.26 23.56 12.42Q22.68 11.58 22.68 10.10Q22.68 8.62 23.56 7.78Q24.44 6.94 25.99 6.94ZM30.69 4.74L32.61 4.74L32.61 13.10L30.69 13.10L30.69 4.74Z" fill="#fff"/></svg></span>\n</a>\n<div class="actions">\n  <button class="menu-btn" id="mb" type="button" aria-label="Mở menu" aria-expanded="false" aria-controls="sheet"><i></i><i></i><i></i></button>\n</div>\n\n<nav class="glass sheet" id="sheet" aria-label="Menu">\n  <p class="mh">Chế độ tải nhanh</p>\n  <button type="button" data-m="tt_vid">TikTok Video<small>Không logo</small></button>\n  <button type="button" data-m="tt_story">Nhật ký TikTok<small>Story & nhạc</small></button>\n  <button type="button" data-m="tt_slide">Slide Ảnh & Nhạc<small>Tải lẻ / gộp</small></button>\n  <button type="button" data-m="tt_cmt">Bình luận TikTok<small>Sticker & Live</small></button>\n  <button type="button" data-m="yt">YouTube & Shorts<small>MP4 / MP3</small></button>\n  <hr>\n  <a href="#his">Lịch sử đã tải<small id="mhis">0</small></a>\n  <a href="#hd">Hướng dẫn sử dụng</a>\n  <a href="#set">Cài đặt giao diện</a>\n</nav>\n\n<div class="wrap">\n<main>\n<section class="view" id="v-dl">\n  <header class="top">\n    <h1>Tải Video, Ảnh & Bình luận</h1>\n    <p class="tag">Hỗ trợ TikTok Video, Nhật ký (Story), Slide ảnh, Nhạc nền, Sticker/Live Photo bình luận và YouTube</p>\n  </header>\n\n  <div class="tbox">\n    <form id="dlf" novalidate>\n      <div class="url-w">\n        <input class="url-in" id="url" type="url" inputmode="url" autocomplete="off" autocapitalize="none" placeholder="Dán link TikTok, bình luận, nhật ký hoặc YouTube…" aria-label="Liên kết cần tải">\n        <button class="ibtn" id="btn-clr" type="button" hidden>Xóa</button>\n        <button class="ibtn" id="btn-pst" type="button">Dán</button>\n      </div>\n      <button class="go-btn" id="btn-go" type="submit">\n        <span id="go-txt">Phân tích & lấy link tải</span>\n        <i class="spin"></i>\n      </button>\n    </form>\n\n  </div>\n  <div id="res" aria-live="polite"></div>\n\n  <h2>Hỗ trợ toàn diện</h2>\n  <div class="fgrid">\n    <div class="fcard">\n      <b>TikTok & Nhật ký</b>\n      <span>Tải video và nhật ký (Story 24h) ở độ phân giải gốc Full HD không dính watermark hay ID người đăng.</span>\n    </div>\n    <div class="fcard">\n      <b>Ảnh Slide & Nhạc nền</b>\n      <span>Tự tách từng ảnh chất lượng cao từ bài đăng cuộn ảnh kèm file âm thanh MP3 gốc riêng biệt.</span>\n    </div>\n    <div class="fcard">\n      <b>Bình luận TikTok</b>\n      <span>Lấy nhãn dán (Sticker trong suốt), ảnh bình luận và cả gói Live Photo (Ảnh + Video chuyển động .MOV).</span>\n    </div>\n    <div class="fcard">\n      <b>YouTube & Shorts</b>\n      <span>Tải video MP4 (1080p, 2K, 4K), Shorts không viền, tách nhạc MP3 320kbps và lưu ảnh thu nhỏ (Thumbnail).</span>\n    </div>\n  </div>\n</section>\n<section class="view" id="v-his" hidden>\n  <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:12px">\n    <h2 style="margin:0">Lịch sử bóc tách</h2>\n    <button type="button" class="ibtn" id="clr-his">Xóa tất cả</button>\n  </div>\n  <p style="color:var(--muted);font-size:.88rem;margin:6px 0 14px">Các liên kết bạn đã phân tích gần đây được lưu ngay trên trình duyệt này.</p>\n  <ul class="list" id="hlist"></ul>\n  <p class="empty" id="nohis">Chưa có lịch sử tải xuống nào.</p>\n</section>\n<section class="view" id="v-hd" hidden>\n  <h2 style="margin-top:12px">Cách lấy link chuẩn</h2>\n  <div class="item">\n    <h3>1. Lấy link Nhãn dán / Ảnh / Live Photo trong bình luận TikTok</h3>\n    <ol>\n      <li>Mở phần bình luận của video TikTok có chứa ảnh, nhãn dán hoặc Live Photo.</li>\n      <li>Nhấn giữ vào bình luận đó (hoặc bấm biểu tượng chia sẻ cạnh bình luận) và chọn <b>Sao chép liên kết</b>.</li>\n      <li>Dán vào ô tìm kiếm trên trang này, công cụ sẽ tự tách riêng file ảnh tĩnh, GIF nhãn dán và file chuyển động <code>.MOV</code> của Live Photo.</li>\n    </ol>\n  </div>\n  <div class="item">\n    <h3>2. Lấy link Nhật ký (Story) & Slide ảnh TikTok</h3>\n    <ol>\n      <li>Ở giao diện xem Nhật ký (Story) hoặc bài đăng nhiều ảnh, bấm nút <b>Chia sẻ (Mũi tên)</b> → <b>Sao chép liên kết</b>.</li>\n      <li>Khi dán link vào trang, bạn có thể chọn tải lẻ từng tấm ảnh, tải toàn bộ slide ảnh hoặc chỉ tải riêng nhạc nền MP3.</li>\n    </ol>\n  </div>\n  <div class="item">\n    <h3>3. Lưu Video & Live Photo về thư viện điện thoại</h3>\n    <ol>\n      <li>Trên iPhone (Safari): sau khi bấm tải về, mở biểu tượng <b>Tải về (mũi tên xuống)</b> trên thanh địa chỉ → mở file → chọn <b>Chia sẻ → Lưu video</b>.</li>\n      <li>Trên Android (Chrome): video, ảnh và nhạc MP3 sẽ tự động lưu thẳng vào thư mục <b>Tệp đã tải xuống (Downloads)</b> hoặc bộ sưu tập ảnh.</li>\n    </ol>\n  </div>\n</section>\n<section class="view" id="v-set" hidden>\n  <h2 style="margin-top:12px">Giao diện & hiển thị</h2>\n  <div class="scard">\n    <div class="srow col">\n      <div class="slb"><b>Chế độ nền</b><small id="thm-sub">Tự động theo thiết bị của bạn</small></div>\n      <div class="seg" id="thm" role="group" aria-label="Chế độ nền">\n        <button type="button" data-thm="system">Hệ thống</button>\n        <button type="button" data-thm="light">Sáng</button>\n        <button type="button" data-thm="dark">Tối</button>\n      </div>\n    </div>\n    <div class="srow col">\n      <div class="slb"><b>Cỡ chữ</b><small>Điều chỉnh độ lớn văn bản trên trang công cụ</small></div>\n      <div class="seg" id="fsz" role="group" aria-label="Cỡ chữ">\n        <button type="button" data-fs="sm">Nhỏ</button>\n        <button type="button" data-fs="md">Mặc định</button>\n        <button type="button" data-fs="lg">Lớn</button>\n      </div>\n    </div>\n  </div>\n\n  <h2>Tùy chọn tải xuống</h2>\n  <div class="scard">\n    <div class="srow">\n      <div class="slb"><b>Ưu tiên bản không dính logo</b><small>Đặt nút tải HD No-Watermark làm mặc định trên đầu</small></div>\n      <button type="button" class="tgl" id="tg-nwm" role="switch" aria-checked="true" aria-label="Ưu tiên bản không logo"><i></i></button>\n    </div>\n    <div class="srow">\n      <div class="slb"><b>Lưu lịch sử tự động</b><small>Ghi nhớ các link đã phân tích trên thiết bị</small></div>\n      <button type="button" class="tgl" id="tg-his" role="switch" aria-checked="true" aria-label="Lưu lịch sử tự động"><i></i></button>\n    </div>\n    <div class="srow">\n      <div class="slb"><b>Hiệu ứng chuyển động</b><small>Hiệu ứng mượt khi hiện thẻ kết quả và chuyển tab</small></div>\n      <button type="button" class="tgl" id="tg-mot" role="switch" aria-checked="true" aria-label="Hiệu ứng chuyển động"><i></i></button>\n    </div>\n  </div>\n\n  <button class="arow" id="rst-cfg" type="button"><span>Khôi phục cài đặt mặc định<small>Đưa giao diện, cỡ chữ và tùy chọn về ban đầu</small></span><span>Đặt lại</span></button>\n</section>\n</main>\n\n<footer class="ft">\n  <span>© 2026 <b>huuanh tool</b> · Công cụ tải media không logo · v7</span>\n  <div style="display:flex;gap:14px">\n    <a href="#hd">Hướng dẫn</a>\n    <a href="#set">Cài đặt</a>\n  </div>\n</footer>\n</div>\n<div class="dock">\n <nav class="glass tabs" aria-label="Điều hướng chính">\n  <i class="ind" aria-hidden="true"></i>\n  <a href="#dl" data-t="dl">\n    <svg class="i-out" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>\n    <svg class="i-fil" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 4.5a1 1 0 1 0-2 0v5.59l-1.8-1.8a1 1 0 0 0-1.4 1.42l3.5 3.5a1 1 0 0 0 1.4 0l3.5-3.5a1 1 0 0 0-1.4-1.42L13 12.09V6.5zm-4.5 9.5a1 1 0 1 0 0 2h7a1 1 0 1 0 0-2h-7z"/></svg>\n    <span>Tải xuống</span>\n  </a>\n  <a href="#his" data-t="his">\n    <svg class="i-out" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>\n    <svg class="i-fil" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 5a1 1 0 1 0-2 0v5c0 .35.18.68.47.86l3.5 2.1a1 1 0 1 0 1.06-1.72L13 11.43V7z"/></svg>\n    <span>Lịch sử</span>\n    <b id="badge" hidden>0</b>\n  </a>\n  <a href="#hd" data-t="hd">\n    <svg class="i-out" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4"/><circle cx="12" cy="17" r=".8" fill="currentColor"/></svg>\n    <svg class="i-fil" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 5.25a3.25 3.25 0 0 0-3.25 3.25 1 1 0 1 0 2 0 1.25 1.25 0 1 1 1.92 1.05c-.86.55-1.67 1.33-1.67 2.7v.25a1 1 0 1 0 2 0v-.25c0-.53.3-.88.95-1.3A3.25 3.25 0 0 0 12 7.25zm0 8.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z"/></svg>\n    <span>Hướng dẫn</span>\n  </a>\n  <a href="#set" data-t="set">\n    <svg class="i-out" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.77 1.02 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>\n    <svg class="i-fil" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.77 1.02 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/></svg>\n    <span>Cài đặt</span>\n  </a>\n </nav>\n</div>\n\n<div id="toast" role="status"></div>\n\n<script>\nconst $=s=>document.querySelector(s),H=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",\'"\':"&quot;"}[c]));\nconst API_URL="";\nconst DEF_CFG={theme:"system",font:"md",noWm:true,saveHis:true,motion:true,api:API_URL};\nlet cfg={...DEF_CFG},his=[],curMode="auto",curItem=null,selSlides=new Set([0,1,2]);\ntry{cfg={...DEF_CFG,...JSON.parse(localStorage.getItem("hu_dl_cfg")||"{}")}}catch(e){}\ntry{his=JSON.parse(localStorage.getItem("hu_dl_his")||"[]")}catch(e){}\nconst saveCfg=()=>{try{localStorage.setItem("hu_dl_cfg",JSON.stringify(cfg))}catch(e){}};\nconst saveHis=()=>{try{localStorage.setItem("hu_dl_his",JSON.stringify(his))}catch(e){}};\n\nfunction toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2200)}\nconst mqDark=window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)"):null;\nfunction applyCfg(){\n const sysDark=mqDark?mqDark.matches:false;\n const isDark=cfg.theme==="dark"||(cfg.theme==="system"&&sysDark);\n const root=document.documentElement;\n root.classList.toggle("dark",isDark);\n root.style.fontSize=cfg.font==="sm"?"93.75%":cfg.font==="lg"?"106.25%":"100%";\n document.body.classList.toggle("rm",!cfg.motion);\n document.querySelectorAll("#thm button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.thm===cfg.theme));\n const tsub=$("#thm-sub");\n if(tsub)tsub.textContent=cfg.theme==="system"?`Tự động theo thiết bị (${sysDark?"đang dùng nền tối":"đang dùng nền sáng"})`:cfg.theme==="dark"?"Luôn hiển thị giao diện nền tối":"Luôn hiển thị giao diện nền sáng";\n document.querySelectorAll("#fsz button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.fs===cfg.font));\n $("#tg-nwm").setAttribute("aria-checked",String(!!cfg.noWm));\n $("#tg-his").setAttribute("aria-checked",String(!!cfg.saveHis));\n $("#tg-mot").setAttribute("aria-checked",String(!!cfg.motion));\n placeInd();\n}\nif(mqDark&&mqDark.addEventListener)mqDark.addEventListener("change",applyCfg);\nconst SAMPLES={\n tt_vid:{\n  kind:"tt_vid",\n  badge:"TikTok Video · Không logo",\n  url:"https://www.tiktok.com/@minhanh.film/video/7432910482910",\n  title:"Chiều thu Hà Nội qua lăng kính film Kodak Gold 200 #hanoi #filmphotography",\n  author:"@minhanh.film · Minh Anh",\n  dur:"00:42",\n  stats:["1080×1920 (60fps)","18.4 MB","Âm thanh gốc AAC"],\n  color:"#FFD85E",\n  downloads:[\n   {id:"nwm_hd",label:"Tải Video HD (Không dính logo)",sub:"MP4 · 1080p60 · Đã gỡ watermark",tag:"18.4 MB",pri:true,ext:"mp4"},\n   {id:"src_max",label:"Tải Video Nguồn Gốc (Source)",sub:"MP4 · Bitrate gốc cao nhất từ máy chủ",tag:"26.1 MB",pri:false,ext:"mp4"},\n   {id:"mp3",label:"Tải Nhạc nền / Âm thanh riêng",sub:"MP3 · 320kbps · Nhạc nền gốc",tag:"1.8 MB",pri:false,ext:"mp3"},\n   {id:"cover",label:"Tải Ảnh bìa Video (Thumbnail)",sub:"WEBP/JPG · Độ phân giải gốc",tag:"420 KB",pri:false,ext:"jpg"}\n  ]\n },\n tt_story:{\n  kind:"tt_story",\n  badge:"Nhật ký TikTok (Story 24h)",\n  url:"https://www.tiktok.com/@minhanh.film/story/7432988120312",\n  title:"Nhật ký của @minhanh.film · Hậu trường buổi chụp Hồ Tây sáng sớm",\n  author:"@minhanh.film · Đăng 3 giờ trước",\n  dur:"00:15",\n  stats:["Story Không Logo","1080p","Tự hủy sau 24h"],\n  color:"#F0C23C",\n  downloads:[\n   {id:"story_nwm",label:"Tải Nhật ký Video (Không logo)",sub:"MP4 · 1080p · Không viền tên tài khoản",tag:"7.2 MB",pri:true,ext:"mp4"},\n   {id:"story_mp3",label:"Tải Nhạc gắn trong Nhật ký",sub:"MP3 · Tách âm thanh gốc từ Story",tag:"890 KB",pri:false,ext:"mp3"},\n   {id:"story_img",label:"Tải Khung hình bìa Nhật ký",sub:"JPG · 1080×1920",tag:"350 KB",pri:false,ext:"jpg"}\n  ]\n },\n tt_slide:{\n  kind:"tt_slide",\n  badge:"Slide Ảnh & Nhạc TikTok",\n  url:"https://www.tiktok.com/@minhanh.film/photo/7433019283711",\n  title:"Bộ 4 công thức chỉnh màu Lightroom tone trong trẻo cho ảnh ngoại cảnh",\n  author:"@minhanh.film · 4 ảnh + Nhạc nền",\n  dur:"4 ảnh",\n  stats:["Ảnh gốc không logo","2160×2700 px","Kèm nhạc MP3"],\n  color:"#303030",\n  slides:[\n   {idx:1,name:"Ảnh 01 · Bìa preset",res:"2160×2700",c:"#FFD85E"},\n   {idx:2,name:"Ảnh 02 · Thông số Ánh sáng",res:"2160×2700",c:"#F0C23C"},\n   {idx:3,name:"Ảnh 03 · Bảng pha màu HSL",res:"2160×2700",c:"#5E5E5A"},\n   {idx:4,name:"Ảnh 04 · Kết quả Before/After",res:"2160×2700",c:"#1E1E1E"}\n  ],\n  downloads:[\n   {id:"slide_sel",label:"Tải các ảnh đã chọn (Không logo)",sub:"JPG chất lượng gốc · Không chèn chữ TikTok",tag:"Tải ảnh",pri:true,ext:"jpg"},\n   {id:"slide_all",label:"Tải trọn bộ tất cả 4 ảnh",sub:"Lưu toàn bộ album ảnh độ phân giải cao",tag:"9.6 MB",pri:false,ext:"zip"},\n   {id:"slide_mp3",label:"Tải Nhạc nền của Slide ảnh",sub:"MP3 · 320kbps · Giai điệu lofi đính kèm",tag:"2.4 MB",pri:false,ext:"mp3"}\n  ]\n },\n tt_cmt:{\n  kind:"tt_cmt",\n  badge:"Bình luận TikTok · Sticker & Live Photo",\n  url:"https://www.tiktok.com/@minhanh.film/video/7432910482910?comment_id=743292219081",\n  title:"Bình luận của @linhchi.design: “Gửi mọi người chiếc meme và Live Photo mèo cam nhé!”",\n  author:"@linhchi.design · Bình luận đính kèm media",\n  dur:"Live + Sticker",\n  stats:["Không dính logo","Live Photo (.JPG + .MOV)","Sticker nền trong"],\n  color:"#000000",\n  downloads:[\n   {id:"cmt_live",label:"Tải Live Photo gốc (Ảnh + Video .MOV)",sub:"Giữ nguyên hiệu ứng nhấn giữ chuyển động trên iPhone/Android",tag:"Live 3.8 MB",pri:true,ext:"mov"},\n   {id:"cmt_sticker",label:"Tải Nhãn dán (Sticker động không nền)",sub:"GIF / WEBP trong suốt · Không dính viền",tag:"940 KB",pri:false,ext:"gif"},\n   {id:"cmt_img",label:"Tải Ảnh tĩnh trong bình luận",sub:"PNG gốc · Không đóng dấu",tag:"1.2 MB",pri:false,ext:"png"}\n  ]\n },\n yt:{\n  kind:"yt",\n  badge:"YouTube Video & Shorts",\n  url:"https://www.youtube.com/watch?v=dQw4w9WgXcQ",\n  title:"Hướng dẫn thiết kế giao diện Bio Link tối giản chuẩn UX/UI 2026",\n  author:"Minh Anh Studio · YouTube Official",\n  dur:"10:24",\n  stats:["4K UHD (2160p)","MP4 / WEBM","MP3 320kbps"],\n  color:"#FFD85E",\n  downloads:[\n   {id:"yt_1080",label:"Tải Video Full HD 1080p (MP4)",sub:"H.264 + AAC · Tương thích mọi điện thoại & máy tính",tag:"64.2 MB",pri:true,ext:"mp4"},\n   {id:"yt_4k",label:"Tải Video 4K Ultra HD (2160p60)",sub:"Bản nét nhất · Không giảm chất lượng",tag:"182 MB",pri:false,ext:"mp4"},\n   {id:"yt_mp3",label:"Tải Âm thanh / Nhạc MP3 (320kbps)",sub:"Tách âm thanh chất lượng cao",tag:"9.8 MB",pri:false,ext:"mp3"},\n   {id:"yt_thumb",label:"Tải Ảnh bìa YouTube (MaxRes 4K)",sub:"JPG · 1920×1080",tag:"520 KB",pri:false,ext:"jpg"}\n  ]\n }\n};\n\nfunction artSvg(kind,c="#FFD85E"){\n if(kind==="tt_slide")return `<svg viewBox="0 0 120 120" aria-hidden="true"><rect width="120" height="120" fill="${c}"/><rect x="22" y="24" width="64" height="72" rx="8" fill="#fff" opacity=".45"/><rect x="34" y="20" width="64" height="72" rx="8" fill="#fff"/><circle cx="54" cy="44" r="7" fill="${c}"/><path d="M34 82l22-20 14 12 12-10 16 18z" fill="${c}" opacity=".75"/></svg>`;\n if(kind==="tt_cmt")return `<svg viewBox="0 0 120 120" aria-hidden="true"><rect width="120" height="120" fill="#1E1E1E"/><path d="M26 32h68a8 8 0 0 1 8 8v40a8 8 0 0 1-8 8H54l-18 14V88h-10a8 8 0 0 1-8-8V40a8 8 0 0 1 8-8z" fill="#FFD85E"/><circle cx="48" cy="60" r="6" fill="#000"/><circle cx="72" cy="60" r="6" fill="#000"/></svg>`;\n if(kind==="yt")return `<svg viewBox="0 0 120 120" aria-hidden="true"><rect width="120" height="120" fill="#FFD85E"/><rect x="20" y="32" width="80" height="56" rx="14" fill="#000"/><path d="M52 46l24 14-24 14z" fill="#FFD85E"/></svg>`;\n if(kind==="tt_story")return `<svg viewBox="0 0 120 120" aria-hidden="true"><rect width="120" height="120" fill="#F0C23C"/><circle cx="60" cy="60" r="38" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="12 6"/><circle cx="60" cy="60" r="28" fill="#fff"/><path d="M54 48l20 12-20 12z" fill="#000"/></svg>`;\n return `<svg viewBox="0 0 120 120" aria-hidden="true"><rect width="120" height="120" fill="${c}"/><circle cx="60" cy="60" r="30" fill="#fff"/><path d="M53 46l22 14-22 14z" fill="#000"/></svg>`;\n}\n\nfunction detectKind(u,mode){\n if(mode&&mode!=="auto")return mode;\n const s=u.toLowerCase();\n if(s.includes("youtube.com")||s.includes("youtu.be"))return "yt";\n if(s.includes("comment")||s.includes("sticker")||s.includes("live"))return "tt_cmt";\n if(s.includes("story"))return "tt_story";\n if(s.includes("photo")||s.includes("slide"))return "tt_slide";\n return "tt_vid";\n}\n\nfunction renderResult(item){\n curItem=item;\n const dls=[...item.downloads];\n if(!cfg.noWm&&dls.length>1){const first=dls.shift();dls.splice(1,0,first)}\n let slidesHtml="";\n if(item.kind==="tt_slide"&&item.slides){\n  slidesHtml=`<div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:.84rem"><span style="font-weight:600">Chọn ảnh muốn tải (${selSlides.size}/${item.slides.length})</span><button type="button" class="ibtn" id="tog-all-sl" style="padding:4px 10px;font-size:.78rem">${selSlides.size===item.slides.length?"Bỏ chọn hết":"Chọn tất cả"}</button></div><div class="sgrid">`+\n  item.slides.map((sl,idx)=>{\n   const on=selSlides.has(idx);\n   const slThumb=sl.img?`<img src="${H(sl.img)}" alt="${H(sl.name)}" loading="lazy">`:artSvg("tt_slide",sl.c);\n   return `<div class="sitem${on?" sel":""}" data-sl="${idx}" role="checkbox" aria-checked="${on}" tabindex="0"><div class="sth">${slThumb}</div><div class="sbar"><span>${H(sl.name)}</span><span class="schk">${on?"✓":""}</span></div></div>`;\n  }).join("")+`</div>`;\n }\n const mainThumb=item.thumb?`<img src="${H(item.thumb)}" alt="" loading="lazy">`:artSvg(item.kind,item.color);\n $("#res").innerHTML=`<article class="rcard">\n  <div class="rhead">\n    <div class="rth">${mainThumb}<span class="rdur">${H(item.dur)}</span></div>\n    <div class="rmeta">\n      <span class="rbdg"><i></i>${H(item.badge)}</span>\n      <h3>${H(item.title)}</h3>\n      <div class="rauthor">${H(item.author)}</div>\n      <div class="rstats">${(item.stats||[]).map(st=>`<span>${H(st)}</span>`).join("")}</div>\n    </div>\n  </div>\n  ${slidesHtml}\n  <div class="dl-list">\n    ${dls.map((d,idx)=>`<button type="button" class="dl-btn${idx===0?" pri":""}" data-dl="${H(d.id)}">\n      <span>${H(d.label)}<small>${H(d.sub||"")}</small></span>\n      <span class="dl-tag">${H(d.tag||"")}</span>\n    </button>`).join("")}\n  </div>\n </article>`;\n}\n\nfunction renderHis(){\n $("#mhis").textContent=his.length;\n $("#badge").hidden=!his.length;\n $("#badge").textContent=his.length;\n $("#nohis").hidden=his.length>0;\n $("#hlist").innerHTML=his.map((h,i)=>`<li class="hrow">\n  <div class="hth">${h.thumb?`<img src="${H(h.thumb)}" alt="" loading="lazy">`:artSvg(h.kind,h.color)}</div>\n  <div class="htx">\n    <b>${H(h.title)}</b>\n    <small>${H(h.badge)} · ${H(h.author)}</small>\n  </div>\n  <div class="hacts">\n    <button type="button" data-hopen="${i}">Mở lại</button>\n    <button type="button" data-hdel="${i}" aria-label="Xóa">✕</button>\n  </div>\n </li>`).join("");\n}\n\nfunction triggerRealUrlDownload(fileUrl,fileName){\n const a=document.createElement("a");\n a.href=fileUrl;\n if(fileName)a.download=fileName;\n a.rel="noopener";\n document.body.appendChild(a);\n a.click();\n a.remove();\n}\n\nfunction triggerSampleDownload(dl,item){\n if(dl.id==="slide_sel"&&Array.isArray(item.slides)){\n  const chosen=item.slides.filter((_,idx)=>selSlides.has(idx)&&item.slides[idx].url);\n  if(chosen.length){\n   chosen.forEach((sl,i)=>setTimeout(()=>triggerRealUrlDownload(sl.url,`huuanh-slide-${sl.idx}.jpg`),i*350));\n   return;\n  }\n }\n if(dl.id==="slide_all"&&Array.isArray(item.slides)){\n  const allReal=item.slides.filter(sl=>sl.url);\n  if(allReal.length){\n   allReal.forEach((sl,i)=>setTimeout(()=>triggerRealUrlDownload(sl.url,`huuanh-slide-${sl.idx}.jpg`),i*350));\n   return;\n  }\n }\n if(dl.url){\n  triggerRealUrlDownload(dl.url,`huuanh-${item.kind}-${dl.id}.${dl.ext||"mp4"}`);\n  return;\n }\n const content=`huuanh tool - File mô phỏng tải xuống\\n-----------------------------------\\nTiêu đề: ${item.title}\\nPhân loại: ${item.badge}\\nTác giả: ${item.author}\\nĐịnh dạng yêu cầu: ${dl.label} (.${dl.ext})\\nLiên kết gốc: ${item.url}\\n\\n(Khi bạn gắn API_URL trong code, nút này sẽ tải trực tiếp luồng dữ liệu media gốc về máy.)`;\n const blob=new Blob([content],{type:"text/plain;charset=utf-8"});\n const url=URL.createObjectURL(blob);\n const a=document.createElement("a");\n a.href=url;\n a.download=`huuanh-${item.kind}-${dl.id}.${dl.ext}.txt`;\n document.body.appendChild(a);\n a.click();\n a.remove();\n setTimeout(()=>URL.revokeObjectURL(url),1500);\n}\n\nfunction cleanInputUrl(raw){\n const s=String(raw||"").trim();\n const m=s.match(/https?:\\/\\/[^\\s"\'<>]+/i);\n return m?m[0]:s;\n}\nasync function analyzeUrl(rawUrl,forcedKind){\n const u=cleanInputUrl(rawUrl);\n if(!u){toast("Dán liên kết TikTok hoặc YouTube vào ô trước nhé");$("#url").focus();return}\n if(urlIn.value!==u){urlIn.value=u;btnClr.hidden=false}\n const btn=$("#btn-go"),txt=$("#go-txt");\n btn.classList.add("busy");btn.disabled=true;txt.textContent="Đang bóc tách media không logo…";\n const kind=forcedKind||detectKind(u,curMode);\n const apiEndpoint=API_URL||cfg.api||(location.protocol.startsWith("http")?"/api":"");\n let item=null;\n if(apiEndpoint){\n  try{\n   const callApi=async pre=>{const r=await fetch(apiEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(pre?{url:u,mode:kind,preloaded:pre}:{url:u,mode:kind})});return r.json()};\n   let data=await callApi();\n   if(data&&data.ok===false&&kind!=="yt"&&data.code!=="comment_not_found"){\n    try{\n     const r=await fetch("https://www.tikwm.com/api/?url="+encodeURIComponent(u)+"&hd=1");\n     const j=await r.json();\n     if(j&&j.code===0&&j.data){const d2=await callApi(j.data);if(d2&&d2.ok!==false)data=d2}\n    }catch(e){}\n   }\n   if(data&&data.ok===false){\n    if(data.debug){console.log("debug",data.debug);$("#res").innerHTML=\'<article class="rcard"><b>Chi tiết lỗi (gửi ảnh này để được hỗ trợ)</b><pre style="white-space:pre-wrap;word-break:break-all;font-size:.74rem;color:var(--muted);margin:10px 0 0">\'+H(data.debug.join("\\n"))+\'</pre></article>\'}\n    btn.classList.remove("busy");btn.disabled=false;txt.textContent="Phân tích & lấy link tải";\n    toast(data.error||"Không thể bóc tách liên kết này");\n    return;\n   }\n   if(data&&data.title)item=data;\n  }catch(e){\n   btn.classList.remove("busy");btn.disabled=false;txt.textContent="Phân tích & lấy link tải";\n   toast("Không kết nối được máy chủ API");\n   return;\n  }\n }\n if(!item){\n  btn.classList.remove("busy");btn.disabled=false;txt.textContent="Phân tích & lấy link tải";\n  toast("Máy chủ không trả về dữ liệu hợp lệ");\n  return;\n }\n btn.classList.remove("busy");btn.disabled=false;txt.textContent="Phân tích & lấy link tải";\n const slideCount=Array.isArray(item.slides)?item.slides.length:4;\n selSlides=new Set(Array.from({length:slideCount},(_,i)=>i));\n renderResult(item);\n if(cfg.saveHis){\n  his=[item,...his.filter(x=>x.url!==item.url)].slice(0,20);\n  saveHis();renderHis();\n }\n toast("Đã bóc tách thành công!");\n}\nconst urlIn=$("#url"),btnClr=$("#btn-clr");\nurlIn.oninput=()=>{btnClr.hidden=!urlIn.value.trim()};\nbtnClr.onclick=()=>{urlIn.value="";btnClr.hidden=true;urlIn.focus()};\nasync function pasteClip(){\n try{\n  const t=await navigator.clipboard.readText();\n  if(t){urlIn.value=t.trim();btnClr.hidden=false;toast("Đã dán liên kết từ bộ nhớ tạm");analyzeUrl(urlIn.value);return}\n }catch(e){}\n urlIn.focus();\n toast("Nhấn giữ vào ô nhập để dán liên kết của bạn");\n}\n$("#btn-pst").onclick=pasteClip;\n\n$("#dlf").onsubmit=e=>{e.preventDefault();analyzeUrl(urlIn.value)};\ndocument.body.addEventListener("click",e=>{\n const sl=e.target.closest("[data-sl]");\n if(sl&&curItem){\n  const i=+sl.dataset.sl;\n  if(selSlides.has(i))selSlides.delete(i);else selSlides.add(i);\n  renderResult(curItem);\n  return;\n }\n if(e.target.closest("#tog-all-sl")&&curItem&&curItem.slides){\n  if(selSlides.size===curItem.slides.length)selSlides.clear();\n  else curItem.slides.forEach((_,i)=>selSlides.add(i));\n  renderResult(curItem);\n  return;\n }\n const dlBtn=e.target.closest("[data-dl]");\n if(dlBtn&&curItem){\n  const id=dlBtn.dataset.dl;\n  if(id==="slide_sel"&&!selSlides.size){toast("Hãy chọn ít nhất 1 tấm ảnh để tải");return}\n  const dl=curItem.downloads.find(x=>x.id===id)||curItem.downloads[0];\n  toast(id==="slide_sel"?`Đang tải ${selSlides.size} ảnh không logo…`:`Bắt đầu tải: ${dl.label}`);\n  triggerSampleDownload(dl,curItem);\n  return;\n }\n const ho=e.target.closest("[data-hopen]");\n if(ho){\n  const item=his[+ho.dataset.hopen];\n  if(item){urlIn.value=item.url;btnClr.hidden=false;renderResult(item);goto("dl");toast("Đã mở lại thẻ tải xuống")}\n  return;\n }\n const hd=e.target.closest("[data-hdel]");\n if(hd){\n  his.splice(+hd.dataset.hdel,1);saveHis();renderHis();toast("Đã xóa mục khỏi lịch sử");\n }\n});\nlet clrHisArm=0;\n$("#clr-his").onclick=()=>{\n if(!his.length){toast("Lịch sử đang trống");return}\n if(!clrHisArm){clrHisArm=1;$("#clr-his").textContent="Bấm lần nữa để xóa";setTimeout(()=>{clrHisArm=0;$("#clr-his").textContent="Xóa tất cả"},3000);return}\n clrHisArm=0;his=[];saveHis();renderHis();$("#clr-his").textContent="Xóa tất cả";toast("Đã xóa toàn bộ lịch sử");\n};\n$("#thm").onclick=e=>{const b=e.target.closest("[data-thm]");if(!b)return;cfg.theme=b.dataset.thm;saveCfg();applyCfg()};\n$("#fsz").onclick=e=>{const b=e.target.closest("[data-fs]");if(!b)return;cfg.font=b.dataset.fs;saveCfg();applyCfg()};\n$("#tg-nwm").onclick=()=>{cfg.noWm=!cfg.noWm;saveCfg();applyCfg();if(curItem)renderResult(curItem)};\n$("#tg-his").onclick=()=>{cfg.saveHis=!cfg.saveHis;saveCfg();applyCfg()};\n$("#tg-mot").onclick=()=>{cfg.motion=!cfg.motion;saveCfg();applyCfg()};\n$("#rst-cfg").onclick=()=>{cfg={...DEF_CFG};saveCfg();applyCfg();toast("Đã khôi phục cài đặt gốc")};\nconst V=["dl","his","hd","set"];\nlet pi0=1;\nfunction placeInd(){\n const a=document.querySelector(\'.tabs a[aria-current="page"]\'),i=$(".ind");if(!a)return;\n if(pi0)i.style.transition="none";\n i.style.width=a.offsetWidth+"px";i.style.height=a.offsetHeight+"px";i.style.transform="translate("+a.offsetLeft+"px,"+a.offsetTop+"px)";\n if(pi0){i.offsetWidth;i.style.transition="";pi0=0}\n}\nfunction route(n){\n n=n||location.hash.slice(1);if(!V.includes(n))n="dl";\n V.forEach(v=>{\n  $("#v-"+v).hidden=v!==n;\n  const a=document.querySelector(\'.tabs [data-t="\'+v+\'"]\');\n  if(v===n)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");\n });\n placeInd();scrollTo({top:0,behavior:"instant"});\n}\nfunction goto(n){if(location.hash.slice(1)!==n){try{history.pushState(null,"","#"+n)}catch(e){location.hash=n;return}}route(n)}\naddEventListener("hashchange",()=>route());\naddEventListener("resize",placeInd);\nif(document.fonts&&document.fonts.ready)document.fonts.ready.then(placeInd);\ndocument.querySelectorAll(".tabs a").forEach(a=>{\n const n=a.getAttribute("href").slice(1);\n a.addEventListener("pointerup",e=>{if(e.button===0){e.preventDefault();goto(n)}});\n a.addEventListener("click",e=>{e.preventDefault();if(e.detail===0)goto(n)});\n});\n$("#brand").onclick=e=>{e.preventDefault();goto("dl")};\n\nconst mb=$("#mb"),sh=$("#sheet");\nfunction menu(o){\n sh.classList.toggle("open",o);\n mb.setAttribute("aria-expanded",o);\n mb.setAttribute("aria-label",o?"Đóng menu":"Mở menu");\n if(!o)clearTouchActive();\n}\nmb.onclick=()=>menu(!sh.classList.contains("open"));\n\nlet curTouchItem=null;\nfunction setTouchActive(el){\n sh.querySelectorAll(".active").forEach(x=>{if(x!==el)x.classList.remove("active")});\n if(document.activeElement&&sh.contains(document.activeElement)&&document.activeElement!==el){\n  document.activeElement.blur();\n }\n curTouchItem=el||null;\n if(curTouchItem)curTouchItem.classList.add("active");\n}\nfunction clearTouchActive(){\n sh.querySelectorAll(".active").forEach(x=>x.classList.remove("active"));\n curTouchItem=null;\n}\nfunction getItemUnderPoint(x,y){\n const el=document.elementFromPoint(x,y);\n if(!el)return{inSheet:false,item:null};\n return{\n  inSheet:!!el.closest("#sheet"),\n  item:el.closest(".sheet a, .sheet button")\n };\n}\n\nsh.addEventListener("touchstart",e=>{\n if(e.touches.length!==1)return;\n const t=e.touches[0];\n const {item}=getItemUnderPoint(t.clientX,t.clientY);\n if(item)setTouchActive(item);\n},{passive:true});\n\nsh.addEventListener("touchmove",e=>{\n if(e.touches.length!==1)return;\n const t=e.touches[0];\n const {inSheet,item}=getItemUnderPoint(t.clientX,t.clientY);\n if(!inSheet){\n  clearTouchActive();\n  return;\n }\n if(item)setTouchActive(item);\n},{passive:true});\n\nsh.addEventListener("touchcancel",()=>{\n clearTouchActive();\n},{passive:true});\n\nsh.addEventListener("pointermove",e=>{\n if(e.pointerType==="mouse"){\n  setTouchActive(e.target.closest(".sheet a, .sheet button"));\n }\n});\nsh.addEventListener("pointerleave",e=>{\n if(e.pointerType==="mouse"){\n  clearTouchActive();\n }\n});\n\nsh.addEventListener("click",e=>{\n const m=e.target.closest("[data-m]");\n if(m){\n  const k=m.dataset.m;\n  goto("dl");menu(false);\n  curMode=k;\n  if(urlIn.value.trim())analyzeUrl(urlIn.value,k);\n  else{urlIn.focus();toast("Đã chọn: "+m.firstChild.textContent+" — hãy dán link vào ô");}\n  return;\n }\n if(e.target.closest("a,button"))menu(false);\n});\naddEventListener("keydown",e=>{if(e.key==="Escape")menu(false)});\ndocument.addEventListener("click",e=>{if(!e.target.closest("#sheet,#mb"))menu(false)});\ndocument.addEventListener("touchstart",e=>{if(!e.target.closest("#sheet,#mb")&&sh.classList.contains("open"))menu(false)},{passive:true});\napplyCfg();\nrenderHis();\nroute();\n</script>\n</body>\n</html>';

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

    // Nếu người dùng truy cập trang chủ / hoặc xem giao diện HTML
    if (request.method === "GET" && (reqUrl.pathname === "/" || reqUrl.pathname === "/index.html")) {
      return new Response(HTML_CONTENT, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          ...corsHeaders,
        },
      });
    }

    if (reqUrl.pathname === "/proxy") {
      return handleProxyDownload(request, reqUrl, corsHeaders);
    }

    try {
      let rawInput = "";
      let mode = "auto";
      let preloaded = null;

      if (request.method === "POST") {
        const body = await request.json().catch(() => ({}));
        rawInput = (body.url || "").trim();
        mode = (body.mode || "auto").trim();
        preloaded = body.preloaded && typeof body.preloaded === "object" ? body.preloaded : null;
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
        : await extractTikTok(targetUrl, mode, origin, preloaded);

      return jsonResponse(result, 200, corsHeaders);
    } catch (err) {
      return jsonResponse(
        {
          ok: false,
          error: err.message || "Không thể bóc tách liên kết này, vui lòng thử lại.",
          debug: err.debug || undefined,
          code: err.code || undefined,
          v: 7,
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
    Referer: /tiktok|byteoversea|muscdn|ibyteimg|tiktokcdn/i.test(parsed.hostname)
      ? "https://www.tiktok.com/"
      : parsed.origin + "/",
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

const UA_DESKTOP =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const UA_MOBILE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";

async function fetchJson(url, init) {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(9000) });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`phản hồi không phải JSON (HTTP ${res.status})`);
  }
}

// Nguồn 1: tikwm (GET trên www, rồi POST trên domain không www)
async function fromTikwm(fullUrl, errors) {
  const attempts = [
    () =>
      fetchJson(`https://www.tikwm.com/api/?url=${encodeURIComponent(fullUrl)}&hd=1`, {
        headers: { Accept: "application/json", "User-Agent": UA_DESKTOP },
      }),
    () =>
      fetchJson("https://tikwm.com/api/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "User-Agent": UA_DESKTOP,
        },
        body: `url=${encodeURIComponent(fullUrl)}&hd=1`,
      }),
  ];
  for (const attempt of attempts) {
    try {
      const json = await attempt();
      if (json && json.code === 0 && json.data) return json.data;
      errors.push(`tikwm: ${json?.msg || "không có dữ liệu"}`);
    } catch (e) {
      errors.push(`tikwm: ${e?.message || e}`);
    }
  }
  return null;
}

// Nguồn 2: đọc thẳng dữ liệu nhúng trong trang TikTok
async function fromTikTokPage(fullUrl, awemeId, errors) {
  const pageUrl = awemeId ? `https://www.tiktok.com/@_/video/${awemeId}` : fullUrl;
  const res = await fetch(pageUrl, {
    headers: { "User-Agent": UA_MOBILE, "Accept-Language": "en-US,en;q=0.9" },
    redirect: "follow",
    signal: AbortSignal.timeout(9000),
  });
  const html = await res.text();
  const m = html.match(
    /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/
  );
  if (!m) {
    errors.push(`tiktok-page: không tìm thấy dữ liệu trang (HTTP ${res.status})`);
    return null;
  }
  const data = JSON.parse(m[1]);
  const item = data?.__DEFAULT_SCOPE__?.["webapp.video-detail"]?.itemInfo?.itemStruct;
  if (!item) {
    const scope = data?.__DEFAULT_SCOPE__ || {};
    const det = scope["webapp.video-detail"] || {};
    errors.push(
      `tiktok-page: không có dữ liệu video (HTTP ${res.status}, statusCode=${det.statusCode ?? "?"}, statusMsg=${det.statusMsg || "-"}, captcha=${/captcha|verify/i.test(html)}, scopes=${Object.keys(scope).slice(0, 6).join("|")})`
    );
    return null;
  }
  const v = item.video || {};
  const images = (item.imagePost?.images || [])
    .map((i) => i?.imageURL?.urlList?.[0])
    .filter(Boolean);
  const play = v.playAddr || v.downloadAddr || "";
  if (!play && !images.length) {
    errors.push("tiktok-page: không có link media");
    return null;
  }
  return {
    id: item.id || awemeId,
    title: item.desc || "",
    author: {
      unique_id: item.author?.uniqueId || item.author || "",
      nickname: item.author?.nickname || "",
    },
    cover: v.cover || "",
    origin_cover: v.originCover || v.cover || "",
    play,
    hdplay: play,
    wmplay: v.downloadAddr || "",
    music: item.music?.playUrl || "",
    music_info: { title: item.music?.title || "" },
    images,
    duration: Number(v.duration) || 0,
    size: Number(v.size) || 0,
    digg_count: item.stats?.diggCount || 0,
  };
}

async function extractTikTok(rawUrl, mode, origin, preloaded) {
  const fullUrl = await resolveShortUrl(rawUrl);
  let commentId = "";
  let replyId = "";
  let awemeId = "";

  try {
    const u = new URL(fullUrl);
    commentId =
      u.searchParams.get("comment_id") ||
      u.searchParams.get("share_comment_id") ||
      u.searchParams.get("cid") ||
      "";
    replyId = u.searchParams.get("reply_id") || u.searchParams.get("share_reply_id") || "";
    const m = u.pathname.match(/\/(?:video|photo|story|v)\/(\d+)/i);
    if (m) awemeId = m[1];
    if (!awemeId) {
      const itemParam = u.searchParams.get("item_id") || u.searchParams.get("share_item_id");
      if (itemParam && /^\d+$/.test(itemParam)) awemeId = itemParam;
    }
  } catch {}

  if (awemeId && commentId) {
    const cmtResult = await extractTikTokComment(fullUrl, awemeId, commentId, origin, replyId);
    if (cmtResult && cmtResult.ok) return cmtResult;
    const failure = new Error(
      "Không tìm thấy đúng bình luận này (hoặc bình luận không có ảnh, Live Photo, nhãn dán). Bình luận quá cũ hoặc nằm quá sâu cũng có thể không tìm được."
    );
    failure.code = "comment_not_found";
    failure.debug = [
      `url: ${fullUrl.slice(0, 300)}`,
      `comment_id=${commentId} reply_id=${replyId || "-"} aweme_id=${awemeId}`,
      ...(cmtResult?.debug || []),
    ];
    throw failure;
  }

  const errors = [];
  const sources = [
    ["tikwm", () => fromTikwm(fullUrl, errors)],
    ["tiktok-page", () => fromTikTokPage(fullUrl, awemeId, errors)],
  ];
  let d =
    preloaded && (preloaded.play || preloaded.hdplay || (Array.isArray(preloaded.images) && preloaded.images.length))
      ? preloaded
      : null;
  if (d) console.log("[tiktok] source=browser-preloaded");
  for (const [name, run] of sources) {
    if (d) break;
    try {
      d = await run();
    } catch (e) {
      errors.push(`${name}: ${e?.message || e}`);
    }
    if (d) {
      console.log(`[tiktok] source=${name}`);
      break;
    }
    console.log(`[tiktok] source=${name} failed`);
  }
  if (!d) {
    console.log("[tiktok] errors:", JSON.stringify(errors));
    const limited = errors.some((e) => /limit/i.test(e));
    const failure = new Error(
      limited
        ? "Các nguồn tải đang quá tải hoặc hết hạn mức hôm nay. Vui lòng thử lại sau ít phút."
        : "Không lấy được dữ liệu từ liên kết TikTok này (mọi nguồn đều lỗi)."
    );
    failure.debug = errors;
    throw failure;
  }

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

async function getTikTokCookie(pageUrl) {
  try {
    const res = await fetch(pageUrl, {
      headers: { "User-Agent": UA_DESKTOP, "Accept-Language": "en-US,en;q=0.9" },
      redirect: "follow",
      signal: AbortSignal.timeout(6000),
    });
    const list = typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [];
    return list.map((c) => c.split(";")[0]).join("; ");
  } catch {
    return "";
  }
}

async function extractTikTokComment(fullUrl, awemeId, commentId, origin, replyId) {
  const debug = [];
  try {
    const headers = { "User-Agent": UA_MOBILE, Referer: fullUrl };
    const wanted = new Set([String(replyId || ""), String(commentId)].filter(Boolean));
    const isTarget = (c) => c && wanted.has(String(c.cid));
    const findIn = (list) => {
      for (const c of list || []) {
        if (isTarget(c)) return c;
        for (const r of c.reply_comment || []) if (isTarget(r)) return r;
      }
      return null;
    };
    let cmt = null;

    if (replyId) {
      try {
        const rj = await fetchJson(
          `https://www.tiktok.com/api/comment/list/reply/?aweme_id=${awemeId}&item_id=${awemeId}&comment_id=${encodeURIComponent(commentId)}&cursor=0&count=50&aid=1988`,
          { headers }
        );
        cmt = findIn(rj?.comments);
        debug.push(`reply-list: ${(rj?.comments || []).length} mục`);
      } catch (e) {
        debug.push(`reply-list: ${e?.message || e}`);
      }
    }

    const cookie = await getTikTokCookie(fullUrl);
    debug.push(`cookie: ${cookie ? cookie.split("; ").map((x) => x.split("=")[0]).join("|") : "không có"}`);
    const base = `https://www.tiktok.com/api/comment/list/?aweme_id=${awemeId}&aid=1988`;
    const scanned = new Set();
    let calls = 0;
    let total = "-";
    const callApi = async (cursor, count, insert, useCookie, tag) => {
      calls++;
      const url =
        `${base}&cursor=${cursor}&count=${count}` +
        (insert ? `&insert_ids=${encodeURIComponent(commentId)}` : "");
      try {
        const j = await fetchJson(url, {
          headers: { "User-Agent": UA_MOBILE, Referer: fullUrl, ...(useCookie && cookie ? { Cookie: cookie } : {}) },
        });
        const list = j?.comments || [];
        list.forEach((c) => scanned.add(String(c.cid)));
        if (j?.total !== undefined) total = j.total;
        const media = list.filter((c) => (c.image_list && c.image_list.length) || c.sticker).length;
        if (debug.length < 22)
          debug.push(`${tag}: ${list.length} bl (${media} media), more=${j?.has_more}, cur=${j?.cursor}`);
        return j;
      } catch (err) {
        if (debug.length < 22) debug.push(`${tag}: ${err?.message || err}`);
        return null;
      }
    };

    // Giai đoạn 1: nhờ TikTok chèn sẵn bình luận cần tìm (kết quả thất thường nên thử lại vài lần)
    for (let i = 0; i < 6 && !cmt; i++) {
      const j = await callApi(0, i % 2 ? 20 : 50, true, i % 3 === 2, `I${i}`);
      cmt = findIn(j?.comments);
      if (i === 0 && j) debug.push(`new_insert_ids=${JSON.stringify(j.new_insert_ids ?? null).slice(0, 80)}`);
    }

    // Giai đoạn 2: duyệt danh sách, trang rỗng/lỗi thì thử lại đúng con trỏ đó thay vì bỏ qua
    let cursor = 0;
    let miss = 0;
    while (!cmt && calls < 30) {
      const j = await callApi(cursor, 50, false, false, `P${calls}`);
      if (!j) {
        if (++miss >= 3) break;
        continue;
      }
      const list = j.comments || [];
      cmt = findIn(list);
      if (cmt || !j.has_more) break;
      if (!list.length && miss < 2) {
        miss++;
        continue;
      }
      miss = 0;
      cursor = Number(j.cursor) || cursor + 50;
    }
    debug.push(`đã quét ${scanned.size} bình luận khác nhau qua ${calls} yêu cầu (bài có ${total})`);

    if (!cmt) return { ok: false, debug };

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

    if (!downloads.length) return { ok: false, debug: ["bình luận không chứa ảnh/nhãn dán"] };

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
  } catch (e) {
    return { ok: false, debug: [...debug, String(e?.message || e)] };
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