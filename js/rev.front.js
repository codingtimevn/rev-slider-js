window.DesignMode && (window.top.RevDesign = window.top.RevDesign || (function ($, window) {
    var Design, editor = $('<iframe>', { 'class': 'theme-editor__iframe' }).insertAfter('#theme-editor-iframe').css({ 'position': 'absolute', 'top': 0 }).hide();
    editor.parent().css({ position: 'relative' });
    window.addEventListener('message', function (e) {
        //if (!~e.origin.indexOf('slide.html')) return;
        Design[e.data.action].apply(Design, e.data.args);
    });

    return Design = $.extend(function (section) {
        $.extend(section, {
            onLoad: function () { },
            onUnload: function () { },
            onSelect: function () {
                if (Design.sections[section.id]) return;
                var panel = $('#section-revolution-slideshow-' + section.id);
                if (!panel.length) return;
                panel.addClass('rev-panel');
                Design.sections[section.id] = { panel: panel }

                var btnEdit = $('<button>', { 'class': 'btn btn--full-width btn-primary', type: 'button', 'text': 'Slider settings' })
                .prependTo(panel.find('.theme-editor__panel-body')).click(function () {
                    Design.editSetting(section.id)
                });
                //btnEdit.next().hide().next().hide();

            },
            onDeselect: function () {
                Design.unLoadEditor();
            },
            onBlockSelect: function (evt) {
                Design.editSlide(evt.detail.sectionId, evt.detail.blockId);
            }
        });
        section.onSelect();
    }, {
        sections: {},
        post: function (action, args) {
            editor[0].contentWindow.postMessage({
                action: action,
                args: args || []
            }, '*');
        },
        loadEditor: function (url, hash) {
            editor.prop('src', 'about:blank');
            setTimeout(function () { editor.show().prop('src', url + '#' + hash) });
        },
        unLoadEditor: function (e) {
            this.post('unLoadEditor');
            editor.hide().prop('src', 'about:blank');
        },
        editSlideReady: function (sectionId, slideId) {
            var li = this.sections[sectionId].panel.find('ul.ui-action-list').children().removeClass('slideEditing')
              .filter('li[data-block-id=' + slideId + ']').addClass('slideEditing');
            this.post('loadSlide', [li.find('textarea').val()]);
        },
        editSettingReady: function (sectionId) {
            this.post('loadSetting', [this.sections[sectionId].panel.find('section textarea').val()]);
        },
        editSetting: function (sectionId) {
            var url = 'https://localhost/rev-slider-js/setting.html';
            if (editor.is(':visible')) {
                this.post('changeEditor', [url, sectionId]);
            } else {
                this.loadEditor(url, sectionId);
                editor.show();
            }
        },
        editSlide: function (sectionId, slideId) {
            var slideEditorUrl = 'https://localhost/rev-slider-js/layer.html';
            if (editor.is(':visible')) {
                this.post('changeEditor', [slideEditorUrl, sectionId, slideId]);
            } else {
                this.loadEditor(slideEditorUrl, sectionId + ',' + slideId);
                editor.show();
            }
        },
        doneEditSlide: function (sectionId, slideId) {
            this.sections[sectionId].panel.find('li[data-block-id=' + slideId + ']').removeClass('sectionId, slideId');
            editor.hide().prop('src', 'about:blank');
        },
        saveSetting: function (sectionId, data) {
            this.sections[sectionId].panel.find('section textarea').val(data).change();
        },
        saveSlide: function (sectionId, slideId, data) {
            this.sections[sectionId].panel.find('li[data-block-id=' + slideId + '] textarea').val(data).change();
        }
    });
})(window.top.jQuery, window.top));




var RevFront = (function ($) {
    return function (section) {
        var $container = section.$container = $(section.containerId);
        var sectionId = section.id = $container.attr('data-section-id');
        var slideshowId = section.slideshow = '#RevSlideshow-' + sectionId;
        if (window.DesignMode) window.top.RevDesign(section);
    }
})(jQuery);