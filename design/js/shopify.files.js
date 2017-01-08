var ShopifyFiles = (function () {
    var docHere = function (f) {
        return f.toString().
        replace(/^[^\/]+\/\*!?/, '').
        replace(/\*\/[^\/]+$/, '');
    },
    url = 'https://coddingtime.myshopify.com/admin/settings/files', //location.origin + 'admin/settings/files',
    style = docHere(function () {/*!



    */}),
    lastWin
    ;
    return function (title, calback, multi) {
        if (lastWin) {
            lastWin.forcus();
            return;
        }
        var win = window.open(url, 'Select file', 'height=700,width=768');
        setTimeout(function () {
            console.log(win.$)
        }, 1000);
        win.window.onload = function () { alert('loadStart'); }
    }
})(jQuery);