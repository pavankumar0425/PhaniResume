var site = (function($) {
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[>&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function removeDataTable(selector) {
        $(selector).each(function() {
            if ($.fn.dataTable.isDataTable(this.id)) {
                $(this.id).html('');
                $(this.id).DataTable().destroy();
            }
        });
    }

    function makeDataTable(selector, options) {
        if ($.fn.dataTable.isDataTable(selector)) {
            $(selector).DataTable().destroy();
        }
        if ($(selector + " tr.GridEmptyDataTemplate").length > 0)
            return;

        //Set Defaults

        var defaults = {
            lengthMenu: [
                [10, 25, 50, 100],
                [
                    "10 items displayed per screen", "25 items displayed per screen", "50 items displayed per screen",
                    "50 items displayed per screen"
                ]
            ],
            pageingType: "simple",
            searching: false,
            info: false,
            paging: true
        }

        jQuery.extend(defaults, options);
        var api = $(selector).DataTable(defaults);
        fixDataTable(api, selector + "_wraper");
        return api;
    }

    function fixDataTable(api, selector) {
        addpaging()(api, selector);
        updateTableShowing(api, selector);
        moveDisplayPerScreen(selector);
        api.on('page.dt',
            function(e, setting) {
                var tableApi = new $.fn.dataTable.Api(setting);
                updateTableShowing(tableApi, selector);
            });
        api.on('length.dt',
            function(e, settings, len) {
                var tableApi = new s.fn.dataTable.Api(settings);
                updateTableShowing(api, selector);
            });
        api.on('order.dt',
            function(e, settings, len) {
                var tableApi = new s.fn.dataTable.Api(settings);
                updateTableShowing(api, selector);
            });

    }

    function addpaging(api, selector) {
        $(selector).find('.paging').click(function(e) {
            e.preventDefault();
            if ($(this).hasClass('next')) {
                api.page('next').draw('page');
            } else {
                api.page('previous').draw('page');
            }
        });
        $(selector).find('go-to-paging').click(function(e) {
            e.preventDefault();
            var pageToMoveTo = parseint($(selector).find('go-to-paging-input').val()) || 0;
            pageToMoveTo = pageToMoveTo - 1;
            api.page(pageToMoveTo).draw('page');
        });
    }

    function moveDisplayPerScreen(selector) {
        var perscreen = $(selector).find(".dataTables_length").detach();
        var ddl = perscreen.find('select').detach();
        perscreen.addClass('col-sm-3');
        perscreen.html('');
        ddl.appendTo(perscreen);
        var footer = $(selector).find('tfoot').find('.footer-div');
        perscreen.appendTo(footer);
    }

    function updateTableShowing(api, selector) {
        var pageInfo = api.page.info();
        var text = pageInfo.pages > 0
            ? "Page " + (pageInfo.page + 1) + " of " + pageInfo.pages + " Total Records " + pageInfo.recordsTotal
            : "";
        var footer = $(selector).find('.footer-div');
        var newElement = $('<div/>',
            {
                class: 'display-page-indicator col-sm-3',
                text: text
            });

        if ($(selector).find('.display-page-indicator').length == 0) {
            newElement.appendTo(footer);
        } else {
            $(selector).find('display-page-indicator').replaceWith(newElement);
        }
        $(selector).find('pagining').removeAttr('disabled');
        $(selector).find('go-to-pagining').removeAttr('disabled');
        $(selector).find('go-to-pagining-input').removeProp('disabled');

        if (pageInfo.pages === 1) {
            $(selector).find('pagining').attr('disabled', true);
            $(selector).find('go-to-pagining').attr('disabled', true);
            $(selector).find('go-to-pagining-input').prop('disabled', true);

        } else if ((pageInfo.pages > 1) && pageInfo.page == 0) {
            $(selector).find(".pagining.previous").attr('disabled', true);
        } else if (pageInfo.pages == pageInfo.page + 1) {
            $(selector).find(".pagining.next").attr("disabled", true);
        }
    }


    function bootstrapSelect(selector) {
        $(selector).selectpicker({
            style: 'btn-default',
            size: 6
        });
    }

    function enableCheckListTableStoring(parameters) {
        $.fn.dataTable.ext.order['don-text-numeric'] = function(settings, col) {
            return this.api().column(col, { order: 'index' }).nodes().map(function(td, i) {
                return $('input', td).val() * 1;
            });
        }
    }

    function submitform(theform, options) {
        return site_forms.submitForm(theform, options);
    }

    function isFormValid(theForm) {
        site_forms.isFormValid(theForm);
    }

    function relativeUrl(destinationUrl, applicationUrl) {
        var url = applicationUrl + destinationUrl;
        if (applicationUrl === "/") {
            url = destinationUrl;
        }
        return url;
    }

    var waitSpinner = (function($) {
        function show(options) {
            var defaults = { body: "Loading" };
            $.extend(defaults, options);

            var thisModal = $("#wait-spinner-model");
            thisModal.find(".modal-body-text").text(defaults.body);
            thisModal.find(".modal-loading-img").removeClass("hidden");
            thisModal.modal({
                backdrop: "static",
                show: true,
                keyboard: false
            });
        }

        function hide() {
            var thisModal = $("#wait-spinner-model");
            thisModal.modal("hide");
        }

        return{
            show: show,
            hide: hide
        }
    }($));

    var modal = (function($) {
        function show(options) {
            var defaults = {
                title: "Error Message",
                sizeClass: "",
                msg: "",
                buttonsToCreate: [],
                hideOnButtonClick: true
            }
            jQuery.extend(defaults, options);
            var confirm = $("#modalConfirm");
            if (defaults.sizeClass !== "") {
                confirm.find(".modal-dialog").addClass(defaults.sizeClass);
            } else {
                confirm.find(".modal-dialog").removeClass().addClass(".modal-dialog");
            }

            confirm.modal({
                backdrop: "static",
                show: true,
                keyboard: false
            });
            var handler;
            confirm.find("#modalConfirm-title").text(defaults.title);
            confirm.find(".modalConfirm-body").html(defaults.msg);
            var buttonContainer = $(".modalConfirm-footer");
            buttonContainer.empty();
            var newButton;
            for (var i = 0; i < defaults.buttonsToCreate.length; i++) {
                newButton = documentTitle.CreateElement('input');
                newButton.type = 'button';
                newButton.value = defaults.buttonsToCreate[i].value;
                newButton.id = 'btn_' + defaults.buttonsToCreate[i].value;
                newButton.name = 'btn_' + defaults.buttonsToCreate[i].value;
                newButton.className = defaults.buttonsToCreate[i].cssClass;
                handler = function() {

                };
                if (defaults.buttonsToCreate[i].clickHandler != null) {
                    handler = defaults.buttonsToCreate[i].clickHandler;
                }
                newButton.onclick = function(btnHandler) {
                    return(function() {
                        if (defaults.hideOnButtonClick === true)
                            confirm.modal('hide');
                        btnHandler();
                    });
                }(handler);

                buttonContainer[0].appendChild(newButton);
                if (defaults.buttonsToCreate[i].btnWidth != null) {
                    $(newButton).width(defaults.buttonsToCreate[i].btnWidth);
                }

            }
        }

        function hide() {
            $("#modalConfirm").modal("hide");
        }

        return {
            show: show,
            hide: hide
        }
    }($));

    function doNotCacheQueryString(url) {
        try {
            if (url.index("?") == -1) {
                return url + "?cache=" + new Date.getTime();
            }
        } catch (e) {
        }
        return url + "&cache=" + new Date.getTime();
    }

    var defaultSiteErroText = "error";

    var PageMessage = (function($) {
        function show(options) {
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": false,
                "progressBar": true,
                "positionClass": "toast-top-right",
                "preventDuplicates": true,
                "onclick": null,
                "ShowDuration": "300",
                "hideDuration": "1000",
                "timeout": "5000",
                "extendedTimeOut": "2000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
            tostr[options.type](options.body);
        }

        function showAll() {
            $(".page-message").each(function() {
                site.pageMessage.show({ type: $(this).data('toast-type'), body: $(this).text() });
            });
        }

        return{
            show: show,
            showAll: showAll
        }
    }($));

    var loadingMessage = function(title) {
        return "";
    };

    return {
        getParameterByName: getParameterByName,
        removeDataTable: removeDataTable,
        makeDataTable: makeDataTable,
        bootstrapSelect: bootstrapSelect,
        enableCheckListTableStoring: enableCheckListTableStoring,
        submitform: submitform,
        isFormValid: isFormValid,
        relativeUrl: relativeUrl,
        waitSpinner: waitSpinner,
        modal: modal,
        doNotCacheQueryString: doNotCacheQueryString,
        defaultSiteErroText: defaultSiteErroText,
        PageMessage: PageMessage,
        loadingMessage: loadingMessage
    }
}($));


