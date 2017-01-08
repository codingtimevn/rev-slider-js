var docHere = function (f) {
    return f.toString().
    replace(/^[^\/]+\/\*!?/, '').
    replace(/\*\/[^\/]+$/, '');
}

window.DesignMode && (window.RevDesign = (function ($, pwin) {
    if (!pwin.RevDesign) {
        $('head').append(docHere(function () {/*!
            <style>
                .rev-panel .ui-action-list .ui-accordion{
                display:none;
                }
                .rev-panel .ui-action-list [aria-expanded="true"]{
                    background: #ebeef0;
                }
                .rev-panel .ui-action-list li{
                    position: relative;
                }
                .rev-panel .ui-action-list .rev-delete{
                    position: absolute;
                    top: 18px;
                    right: 30px;
                }
                .rev-panel .ui-action-list .rev-clone{
                    position: absolute;
                    top: 18px;
                    right: 50px;
                }
            </style>
        */
        }));

        $('#UIModalContents').append(docHere(function () {/*!
        <div id="image_picker_rev_modal" class="ui-modal" role="dialog" aria-hidden="true" aria-labelledby="image_picker_modal_heading" data-preload="false" data-start-visible="false" data-height="false" data-width="false">
          <div class="ui-modal__header"><div class="ui-modal__header-title"><h2 class="ui-title" id="image_picker_modal_heading">Select image</h2></div><div class="ui-modal__header-actions"><div class="ui-modal__close-button"><button class="btn btn--plain" aria-label="Close modal" type="button" name="button"><svg class="next-icon next-icon--color-sky-darker next-icon--size-12"> <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#next-remove"></use> </svg></button></div></div></div>
          <div class="ui-modal__body">
            <div data-bind-show="loading" class="theme-editor__modal__spinner">
              <div class="next-spinner">
                <svg class="next-icon next-icon--size-40"> <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#next-spinner"></use> </svg>
              </div>
            </div>
            <div class="ui-modal__section" data-role="modal-body" data-bind-show="!loading">
              &nbsp;
        </div></div>  <div class="ui-modal__footer"><div class="ui-modal__footer-actions">
            <div class="ui-stack ui-stack--wrap ui-stack--distribution-equal-spacing" style="width: 100%;">
              <div class="next-input-wrapper">
                <div data-role="pagination-target" data-bind-show="!loading"></div>
              </div>
              <div class="next-input-wrapper">
                <button class="btn" data-bind-event-click="action('hideModal')" type="button" name="button">Cancel</button>
                <button class="btn btn-primary" data-bind-disabled="!canSelect" data-bind-event-click="action('selectImage')" type="button" name="button">Select</button>
              </div>
        </div></div></div></div>

        */}))

        pwin.eval(docHere(function () {/*!
            (function($){
                var 
                    sections = {},
                    ewin = function(){return $('#theme-editor-iframe')[0].contentWindow;},                    
                    compressData = function (data) { return data ? btoa(ewin().pako.deflate(data, { to: 'string' })) : ''; },
                    deCompressData = function (data) { return data ? ewin().pako.inflate(atob(data), { to: 'string' }) : '' },
                    changeCompress = function(node,isCompress){
                        var data = node.val();
                        node.val(isCompress?compressData(data):deCompressData(data));
                    }
                ;
                window.RevDesign = {
                    imagePicker: new function(){
                        var
                            picker = UI.Modal.modals.image_picker_modal,
                            btnSize = $('<select>',{'class': 'btn'}).append(function(){
                                var ops = [];
                                $.each({
                                    "": "Original",
                                    "pico": "Pico (16x16)",
                                    "icon": "Icon (32x32)",
                                    "thumb": "Thumb (50x50)",
                                    "small": "Small (100x100)",
                                    "compact": "Compact (160x160)",
                                    "medium": "Medium (240x240)",
                                    "large": "Large (480x480)",
                                    "grande": "Grande (600x600)",
                                    "1024x1024": "1024x1024",
                                    "2048x2048": "2048x2048"
                                },function(v,t){
                                    ops.push($('<option>',{value: v, text:t})[0]);
                                })
                                return ops;
                            }()),
                            btnUpload = $('<div>',{'class':'btn btn-primary styled-file-input', css: {marginLeft: 5 }}).append(
                                $('<label>',{text:'Upload', css: {margin: 0}}),
                                $('<input>',{type:"file", name:"revUploadImage", id:"revUploadImage", "class":"js-placeholder-file-input", accept:"image/*",}).change(function(){

                                })
                            ),
                            tools = picker.$element.find('.ui-modal__footer .ui-stack').children(':last')
                        ;
                        
                        this.show = function(callback){
                            tools.prepend(btnSize,btnUpload);
                            var onClose = picker.onClose;
                            picker.onClose = function(){
                                btnSize.remove();
                                btnUpload.remove();

                                picker.onClose = onClose;
                                return picker.onClose();
                            }
                            btnSize.val('1024x1024');
                            return picker.show({onSelect: function(file){
                                var size = btnSize.val();
                                file.cdn_url = file.cdn_url.replace('_medium.', (size?'_' + size: '') + '.');
                                callback(file);
                            }});
                        }
                    },
                    sections: sections,
                    initsection: function(){
                        if (sections[this.id]) return;
                        var section = this, panel = $('#section-slideshow-rev-' + this.id).addClass('rev-panel');
                        if (!panel.length) return;
                        var
                            list = panel.find('ul.ui-action-list'),
                            areadata = panel.find('#setting-' + this.id + '-data'),
                            compress = panel.find('#setting-' + this.id + '-compress').change(function () {
                                var isCompress = compress.prop('checked');
                                changeCompress(areadata, isCompress);
                                list.find('textarea').each(function () {
                                    changeCompress($(this), isCompress);
                                });
                            })
                        ;
                        sections[this.id] = { panel: panel, list: list, compress: compress, areadata: areadata, section: this }


                        var btnEdit = $('<button>', { 'class': 'btn btn--full-width btn-primary', type: 'button', 'text': 'Slider settings' })
                        .prependTo(panel.find('.theme-editor__panel-body')).click(function () {
                            ewin().RevDesign.post.editSetting(section.id)
                        });
                        var btnDelete, btnClone, btnAddBlock = list.find('[data-bind-show] button.ui-action-list__item--link');
                        panel.on('mouseenter', 'ul>li:not([data-bind-show])', function () {
                            var li = $(this);
                            btnDelete = $('<button>', { type: 'button', 'class': 'btn btn--link rev-delete' }).append('<svg class="next-icon next-icon--color-blue next-icon--size-12 next-icon--inline-before"> <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#next-delete"></use> </svg>').click(function () {
                                li.find('button.btn--link').not(this).click();
                            }).appendTo(li);
                            btnClone = $('<button>', { type: 'button', 'class': 'btn btn--link rev-clone' }).append('<svg class="next-icon next-icon--color-blue next-icon--size-12 next-icon--inline-before"> <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#add-block"></use> </svg>').click(function () {
                                btnAddBlock.click();
                                btnAddBlock.parent().prev().find('textarea').val(btnClone.parent().find('textarea').val());
                            }).appendTo(li);
                        }).on('mouseleave', 'ul>li:not([data-bind-show])', function () {
                            btnDelete.remove();
                            btnClone.remove();
                        });
                    },
                    editor: $('<iframe>', { 'class': 'theme-editor__iframe' }).insertAfter('#theme-editor-iframe').css({ 'position': 'absolute', 'top': 0 }).hide()
                }
                RevDesign.editor.parent().css({ position: 'relative' });

                window.addEventListener('message', function (e) {
                    if (!~revLibUrl.indexOf(e.origin)) return;
                    var win = ewin();
                    win.RevDesign.Evts[e.data.action].apply(win.RevDesign.Evts, e.data.args);
                });
            })(jQuery);
        */}));
    }




    pwin.ShopifyFiles = (function () {
        var
        wait = function (obj, key, callback) {
            var itv = setInterval(function () {
                if (obj[key]) {
                    callback(obj[key]);
                    clearInterval(itv);
                }
            });
        },
        url = pwin.location.origin + '/admin/settings/files',
        style = docHere(function () {/*!
        <style>
        .nav-toggle,.header__main,.nav-drawer{display: none !important;}
        .header-row,.sticky-message{left: 0 !important; }
        #content{padding-left: 0 !important;}
        .insertfile{ position: absolute; top: 0; right: 0; display:none; }
        tr:hover .insertfile{display:block;}
        .selectsizes tr{cursor: pointer;}
        .selectsizes tr:hover{background: #f5f6f7;}
        </style>
        */}),
        script = docHere(function () {/*!
        <script>
        </script>
        */
        }),
        imageSizes = docHere(function () {/*!
        <script type="text/html" class="modal_source" id="modalFileSizes">
            <header>
              <h2>Select file size</h2>
              <button class="btn btn--plain close-modal">×</button>
            </header>
            <div class="body clearfix selectsizes">
                <table onclick="setTimeout(function(){window.close()})" ><tbody>
                        <tr data-id="pico"><td>pico</td><td>16 x 16 pixels</td></tr>
                        <tr data-id="icon"><td>icon</td><td>32 x 32 pixels</td></tr>
                        <tr data-id="thumb"><td>thumb</td><td>50 x 50 pixels</td></tr>
                        <tr data-id="small"><td>small</td><td>100 x 100 pixels</td></tr>
                        <tr data-id="compact"><td>compact</td><td>160 x 160 pixels</td></tr>
                        <tr data-id="medium"><td>medium</td><td>240 x 240 pixels</td></tr>
                        <tr data-id="large"><td>large</td><td>480 x 480 pixels</td></tr>
                        <tr data-id="grande"><td>grande</td><td>600 x 600 pixels</td></tr>
                        <tr data-id="original"><td>original</td><td>1024 x 1024 pixels</td></tr>
                        <tr><td>master</td><td>Original image size</td></tr>
                </tbody></table>
            </div>
        </script>
        */}),
        initFiles = function (panel) {
            var files = panel.find('table tbody tr').each(function () {
                var tds = $(this).children();
                tds.eq(3).children().append($('<button>', { type: 'button', text: 'Insert', 'class': 'insertfile btn btn-primary'/*, 'onclick': 'setTimeout("window.close()")'*/ }).click(function () {
                    //insertFiles([$(this).prev().val()]);
                    var url = $(this).prev().val();
                    var file = url.split('?')[0].split('/'); file = file[file.length - 1].split('.');
                    if (['jpg'].indexOf(file[1].toLowerCase()) > -1) {
                        imgSelected = {
                            url: url,
                            name: file[0],
                            ext: file[1]
                        }
                        modalSizes.show();
                    }else{
                        insertFiles([$(this).prev().val()]);
                    }
                }));
            });
        },
        insertFiles, modalSizes, imgSelected = {}
        ;
        var bindWindow = function (win) {
            wait(win, '$', function ($) {
                $('head').append(style).append(script);
                win.document.addEventListener("page:load", function (e) {                    
                    initFiles($(e.data[5]));
                });



                $(function () {
                    initFiles($('#assets-table'));
                    modalSizes = new win.Shopify.Modal($(imageSizes)[0]);
                    $('#modal_container').on('click', '.selectsizes tr', function () {
                        var id = $(this).data('id');
                        var lastName = imgSelected.name + '.' + imgSelected.ext;
                        var newName = imgSelected.name + '_' + id + '.' + imgSelected.ext;
                        insertFiles([id ? imgSelected.url.replace(lastName, newName) : imgSelected.url]);
                    });
                });
            });

            win.onunload = function () {
                setTimeout(function () {
                    if (win.closed) return;
                    bindWindow(win.window);
                });
            }
        }
        return function (title, callback, multi) {
            var win = window.open(url, title, 'height=700,width=768');
            bindWindow(win);
            if (window.focus) { win.focus() }
            insertFiles = function (files) {
                callback(files);
                win.dispatchEvent(new win.Event('insertfiles', { files: files }));
            }
        }
    })(jQuery);


    var
        Design, Evts,
        sections = pwin.RevDesign.sections,
        editor = pwin.RevDesign.editor,
        compressData = function (data) { return data ? btoa(pako.deflate(data, { to: 'string' })) : ''; },
        deCompressData = function (data) { return data ? pako.inflate(atob(data), { to: 'string' }) : '' },
        post = function (action, args) {
            editor[0].contentWindow.postMessage({
                action: action,
                args: args || []
            }, '*');
        }
    ;

    $.extend(theme.SlideshowRevSection.prototype, {
        onLoad: function () { },
        onUnload: function () { },
        onSelect: pwin.RevDesign.initsection,
        onDeselect: function () {
            post.unLoadEditor();
        },
        onBlockSelect: function (evt) {
            post.editSlide(evt.detail.sectionId, evt.detail.blockId);
        },
        onBlockDeselect: function () {
            editor.is(':visible') && post.unLoadEditor();
        }
    });

    return Design = $.extend(function (section) {
        section.onSelect();
    }, {
        sections: sections,
        post: $.extend(post, {
            editSetting: function (sectionId) {
                var url = revLibUrl + 'design/setting.html';
                if (editor.is(':visible')) {
                    post('changeEditor', [url, sectionId]);
                } else {
                    Evts.loadEditor(url, sectionId);
                    editor.show();
                }
            },
            editSlide: function (sectionId, slideId) {
                var slideEditorUrl = revLibUrl + 'design/layer.html';
                if (editor.is(':visible')) {
                    post('changeEditor', [slideEditorUrl, sectionId, slideId]);
                } else {
                    Evts.loadEditor(slideEditorUrl, sectionId + ',' + slideId);
                    editor.show();
                }
            },
            unLoadEditor: function (e) {
                post('unLoadEditor');
                editor.hide().prop('src', 'about:blank');
            }
        }),
        Evts: Evts = {
            loadEditor: function (url, hash) {
                editor.prop('src', 'about:blank');
                setTimeout(function () { editor.show().prop('src', url + '#' + hash) });
            },
            editSlideReady: function (sectionId, slideId) {
                var data = sections[sectionId].list.find('li[data-block-id=' + slideId + '] textarea').val();
                post('loadSlide', [sections[sectionId].compress.prop('checked') ? deCompressData(data) : data]);
            },
            editSettingReady: function (sectionId) {
                var data = sections[sectionId].areadata.val();
                post('loadSetting', [sections[sectionId].compress.prop('checked') ? deCompressData(data) : data]);
            },
            doneEditSlide: function (sectionId, slideId) {
                editor.hide().prop('src', 'about:blank');
                var li = sections[sectionId].list.find('li[data-block-id=' + slideId + ']');
                li.children('a').click();
                setTimeout(function () {
                    if (li.find('textarea').val() == '') li.find('.btn.btn--link').click();
                });
            },
            doneEditSetting: function (sectionId) {
                editor.hide().prop('src', 'about:blank');
            },
            saveSetting: function (sectionId, data) {
                data = sections[sectionId].compress.prop('checked') ? compressData(data) : data
                sections[sectionId].areadata.val(data).change();
            },
            saveSlide: function (sectionId, slideId, data) {
                data = sections[sectionId].compress.prop('checked') ? compressData(data) : data
                sections[sectionId].list.find('li[data-block-id=' + slideId + '] textarea').val(data).change();
            },
            requireFiles: function (title, multi) {
                pwin.RevDesign.imagePicker.show(function (file) {
                    console.log(file)
                    Design.post('insertFiles', [file.cdn_url]);
                });
            }
        }
    });
})(window.top.jQuery, window.top));




var RevFront = (function ($) {
    var ParseHtml = function (section) {
        var
            transparent = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==',
            $container = $(section.container),
            compressed = $container.data('compress'),
            parseDataNode = function (node) {
                var data = node.data('rev');
                node.removeAttr('data-rev');
                if (!data) return false;
                data = compressed ? JSON.parse(pako.inflate(atob(data), { to: 'string' })) : data;
                return data;
            },
            initSlide = function (slide) {
                var slidesetting = parseDataNode(slide);
                if (!slidesetting) return slide.remove();
                var s = slidesetting.params;
                s['def-slide_transition'] = s['def-slide_transition'] || 'fade';
                var data = {
                    transition:(function(){
                        var rand = s.slide_transition.indexOf('random-selected');
                        if(rand > -1){
                            s.slide_transition.splice(rand,1);
                            data.randomtransition = 'on';
                        }
                        return s.slide_transition.join(',') || 'fade';
                    })(),
                    slotamount: s.slot_amount.join(',') || 7,
                    hideafterloop: s.hideslideafter || 0,
                    easein: s.transition_ease_in.join(',') || 'default',
                    easeout: s.transition_ease_out.join(',') || 'default',
                    masterspeed: s.transition_duration.join(',') || 300,
                    link: (function () {
                        if (s.enable_link == 'false') return;
                        var link;
                        switch (s.link_type) {
                            case 'regular':
                                link = s.link;
                                if (s.link_open_in == 'new') data.target = '_blank';
                                break;
                            case 'slide':
                                if (s.slide_link && s.slide_link != 'nothing') {
                                    if ($.isNumeric(s.slide_link)) {
                                        alert(s.slide_link);
                                    }
                                    link = 'slide';
                                    data.linktoslide = s.slide_link;
                                }
                                break;
                        }
                        if (s.link_pos == 'back') data.slideindex = 'back';
                        return link;
                    })(),
                    delay: s.delay,
                    rotate: s.transition_rotation.map(function (v) {
                        if(v==999) return v;
                        v = v>720?720:v;
                        v = v<-720?-720:v;
                        return v;
                    }).join(','),
                    saveperformance: s.save_performance || 'off',
                    ssop: s.stoponpurpose,
                    invisible: s.invisibleslide,
                    mediafilter: s['media-filter-type'],
                    title: s.title,
                    description: s.slide_description

                };
                
                (function () {
                    var styles = ['preview1', 'preview2', 'preview3', 'preview4', 'custom'];
                    if (!(
                        [s.enable_bullets, s.enable_thumbnails, s.enable_arrows, s.enable_tabs].indexOf('on') > -1 ||
                        styles.indexOf(s.navigation_arrow_style || 'round') > -1 ||
                        styles.indexOf(s.navigation_bullets_style || 'round') > 1
                    )) return;
                    /*
                    s.thumb_dimension = s.thumb_dimension || 'slider';

                    if (s.thumb_dimension == 'slider') {
                        if (['youtube', 'vimeo'].indexOf(params.source_type) > -1 ||
                            ['image', 'vimeo', 'youtube', 'html5', 'streamvimeo', 'streamyoutube', 'streaminstagram', 'streamtwitter', 'streamvimeoboth', 'streamyoutubeboth', 'streaminstagramboth', 'streamtwitterboth'].indexOf() > -1
                            ) {
                        }
                    } else {
                    }
                    */
                    data.thumb = s.slide_thumb;


                })();

                (function () {
                    for (var i = 0; i < 10; i++) {
                        var pa = s['params_' + i];
                        if (pa) data['param' + i] = pa;
                    }
                })();

                slide.attr({
                    'class': s.class_attr,
                    'id': s.id_attr,
                    'data_attr': s.data_attr
                }).data(data);
                s.background_type = s.background_type || 'image';
                //render cover
                var cover = (function () {
                    var cover = $('<img data-no-retina>', { 'class': 'rev-slidebg' }).prop('src',s.image_url);
                    var data = {
                        bgposition: (s.bg_position =='external'|| s.bg_position == 'image') ? 'center center' : (s.bg_position == 'percentage' ? s.bg_position_x + '% ' + s.bg_position_y + '%' : s.bg_position)
                    };

                    if (s.kenburn_effect == 'on' && (s.background_type == 'image' || s.background_type == 'external')) {
                        $.extend(data, {
                            kenburns: 'on',
                            duration: s.kb_duration || settings['def-kb_duration'] || 1000,
                            ease: s.kb_easing || settings['def-kb_easing'] || 'Linear.easeNone',
                            scalestart: s.kb_start_fit || settings['def-kb_start_fit'] || 100,
                            scaleend: s.kb_end_fit || settings['def-kb_end_fit'] || 100,
                            rotatestart: s.kb_start_rotate || settings['def-kb_start_rotate'] || 0,
                            rotateend: s.kb_end_rotate || settings['def-kb_end_rotate'] || 0,
                            offsetstart: (s.kb_start_offset_x || settings['def-kb_start_offset_x'] || 0) + ' ' + (s.kb_start_offset_y || settings['def-kb_start_offset_y'] || 0),
                        });
                    } else if (['youtube', 'html5', 'vimeo', 'streamvimeo', 'streamyoutube', 'streaminstagram', 'streamtwitter'].indexOf(s.background_type)) {
                        data.bgfit = 'cover';
                    } else {
                        data.bgfit = s.bg_fit == 'percentage' ? s.bg_fit_x + '% ' + s.bg_fit_y + '%' : s.bg_fit;
                        data.bgrepeat = s.bg_repeat;
                    }

                    if (settings.use_parallax == 'on') {
                        data.bgparallax = s.slide_parallax_level == '_' ? 'off' : s.slide_parallax_level;
                    }



                    switch(s.background_type){
                        case 'trans':
                            cover[0].src = transparent;
                            break;
                        case 'solid':
                            cover[0].src = transparent;
                            cover.css('background-color',s.bg_color || '#d0d0d0');
                            break;
                        case 'streamvimeo':
                        case 'streamyoutube':
                        case 'streaminstagram':
                        case 'streamtwitter':
                            if(s.stream_do_cover == 'off') cover[0].src = transparent;
                            break;
                        case 'streamvimeoboth':
                        case 'streamyoutubeboth':
                        case 'streaminstagramboth':
                        case 'streamtwitterboth':
                            cover[0].src = transparent;
                            break;
                        case 'external': cover[0].src = s.bg_external;
                        default:
                            if (s.image_source_type !== 'full') {
                                cover.attr({ width: s.ext_width, height: s.ext_height });
                            }
                            break;
                    }

                    if (params.lazy_load_type != 'none') {
                        data.lazyload = cover[0].src
                        cover[0].src = transparent;
                    }
                    return cover.data(data);
                })();
                console.log(s)

                
                



                $.extend(cover.data(), {
                    lazyload: s.image_url,
                    bgposition: 'center top',
                    bgfit: 'cover',
                    bgrepeat: 'no-repeat',
                    bgparallax: 'off',
                    'no-retina': undefined
                });



                var layers = [cover];


                $.each(slidesetting.layers, function () {
                    var layer = front.Layer(this);
                    layers.push(layer);
                });
                slide.append(layers);
            }
        ;
        settings = parseDataNode($container);
        if (!settings) return;
        var params = settings.params, data = {}, slides = $container.find('.items').children();


        //render slider
        if (params['slider-type'] !== 'hero') {
            if (params.first_transition_active == 'on') {
                $.extend(data, {
                    fstransition: s.first_transition_type || 'fade',
                    fsmasterspeed: s.first_transition_duration || 300,
                    fsslotamount: s.first_transition_slot_amount || 7
                });
            }
            params.loop_slide = params.loop_slide || 'loop';
            if ((params.loop_slide == 'loop' || params.loop_slide == 'on') && slides.length == 1) {
                slides.after(slides.clone());
                slides = $container.find('.items').children();
            }        
        }
        $container.addClass('rev_slider').data(data);



        $head.append('<style>' + settings.custom_css + '</style>');
        slides.each(function () { initSlide($(this)) });
        $container.show().revolution({
            sliderType: "standard",
            jsFileLocation: revLibUrl + 'public/js/',
            sliderLayout: "auto",
            dottedOverlay: "none",
            delay: 9000,
            navigation: {
                keyboardNavigation: "off",
                keyboard_direction: "horizontal",
                mouseScrollNavigation: "off",
                mouseScrollReverse: "default",
                onHoverStop: "on",
                touch: {
                    touchenabled: "on",
                    swipe_threshold: 75,
                    swipe_min_touches: 1,
                    swipe_direction: "horizontal",
                    drag_block_vertical: false
                }
                ,
                bullets: {
                    enable: true,
                    hide_onmobile: true,
                    hide_under: 778,
                    style: "hermes",
                    hide_onleave: false,
                    direction: "horizontal",
                    h_align: "center",
                    v_align: "bottom",
                    h_offset: 0,
                    v_offset: 20,
                    space: 5,
                    tmp: ''
                }
            },
            responsiveLevels: [1240, 1024, 778, 480],
            visibilityLevels: [1240, 1024, 778, 480],
            gridwidth: [1230, 1024, 778, 480],
            gridheight: [750, 650, 550, 500],
            lazyType: "single",
            parallax: {
                type: "mouse+scroll",
                origo: "slidercenter",
                speed: 2000,
                levels: [1, 2, 3, 20, 25, 30, 35, 40, 45, 50, 47, 48, 49, 50, 51, 55],
                disable_onmobile: "on"
            },
            shadow: 0,
            spinner: "off",
            stopLoop: "on",
            stopAfterLoops: 0,
            stopAtSlide: 1,
            shuffle: "off",
            autoHeight: "off",
            disableProgressBar: "on",
            hideThumbsOnMobile: "off",
            hideSliderAtLimit: 0,
            hideCaptionAtLimit: 0,
            hideAllCaptionAtLilmit: 0,
            debugMode: false,
            fallbacks: {
                simplifyAll: "off",
                nextSlideOnWindowFocus: "off",
                disableFocusListener: false,
            }
        });
        try{            
            eval(docHere(function () {/*!            
                with({
                }){{{custom_javascript}}}
            */}).replace('{{custom_javascript}}',settings.custom_javascript));
        } catch (e) {
            alert('Revolution slideshow: "Custom javascript is error, please open console(F12) to see error or remove this custom javascript"');
            console.clear();
            console.warn(e)
        };
    }



    var front, loadScripts = {}, $head = $('head');
    $head.append($('<link>', { rel: 'stylesheet', type: "text/css", href: revLibUrl + 'public/css/settings.css' }))
    return front = $.extend(function (section) {
        front.loadScripts([
            'pako.min.js',
            'jquery.themepunch.tools.min.js',
            'jquery.themepunch.revolution.min.js'

        ],function(){
            var slide = new ParseHtml(section);
        }, revLibUrl + 'public/js/');
        if (window.DesignMode) RevDesign(section);
    }, {
        Layer: $.extend(function (data) {
            var layer = $('<div>');
            layer.data(data);
            return layer;
        }, {

        }),
        loadScripts: function (scripts, callback, url) {
            if (typeof scripts == 'string') scripts = [scripts];
            url = url || revLibUrl;
            var loads = [];
            var cache = $.ajaxSettings['cache'];
            $.ajaxSettings['cache'] = true;
            $.each(scripts, function (i,v) {
                if (!loadScripts[v]) loadScripts[v] = $.getScript(url + v);
                loads.push(loadScripts[v]);
            });
            $.ajaxSettings['cache'] = cache;
            $.when.apply($, loads).done(callback);
        }
    });
})(jQuery);