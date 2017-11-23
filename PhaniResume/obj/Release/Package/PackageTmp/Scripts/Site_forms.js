var site_forms = (function ($) {
    function submitForm(theForm, options) {
        debugger;
        //Allow for user to pass in data;
        var settings = theForm.data();

        var defaults = {
            onBeforeSubmit: function () {
                site.waitSpinner.show({
                    body: "Loading..."
                });
            },
            onComplete: function () {
                site.waitSpinner.hide();
            },
            async: true,
            validate: true
        };

        jQuery.extend(defaults, settings);
        jQuery.extend(defaults, options); //setup any options that override the defaults.

        var data;
        if (defaults.hasOwnProperty("data")) {
            data = defaults.data;
        } else {
            data = theForm.find(':input').serialize(); //grab the data
        }

        if (defaults.validate == true) {
            if (isFormValid(theForm) == false) {
                site.pageMessage.show({ type: "error", body: "Some required information is missing or incomplete. Please correct your entries and try again." });
                return;//This should trigger any validation errors.
            } 
        }
            

        //Trigger the before submit handler
        defaults.onBeforeSubmit();
        site.removeDataTables();

        $.ajax({
            url: settings.url,
            type: settings.method,
            data: data,
            cache: false,
            async: defaults.async,
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            success: function (response, textStatus, xhr) {
                try {

                    switch (settings.replaceMethod) {
                        case "Replace":
                            {
                                $(settings.replaceSelector).html(""); // Clean up
                                $(settings.replaceSelector).html(response);
                                $.validator.unobtrusive.parse($(settings.replaceSelector));
                                break;
                            }
                        case "Redirect":
                            {
                                var urlHolder = $(response).filter("#redirect-me"); //filter not find, trust me
                                if (urlHolder.length > 0) {
                                    location.href = urlHolder.attr("href");
                                } else {
                                    $(settings.replaceSelector).html(""); // Clean up
                                    $(settings.replaceSelector).html(response);
                                }
                                break;
                            }
                        case "Custom":
                            {
                                eval(settings.customMethod)(response);
                            }
                        case "Nothing":
                        default:
                    }
                } catch (e) {
                    $(settings.replaceSelector).html(""); // Clean up
                    $(settings.replaceSelector).html(response);
                };
            },

            complete: defaults.onComplete,
            error: function (xhr, textStatus, errorThrown) {
                $(settings.replaceSelector).html("The server encountered an error and could not complete your request. <br /> If the problem persist, please report you problem and mention this error message and the reason that cause it.");
            }
        });
    };

    function isFormValid(theForm) {
        var formIsValid = true;
        try {
            $.validator.unobtrusive.parse(document);

            $(theForm).find(':input').each(function (index, value) {
                var valid = $(this).valid();
                if (valid == false) {
                    formIsValid = false;
                }
            });
            $(theForm).find('select').each(function (index, value) {
                var valid = $(this).valid();
                if (valid == false) {
                    formIsValid = false;
                }
            });
            $(theForm).find('textarea').each(function (index, value) {                
                var valid = $(this).valid();
                if (valid == false) {
                    formIsValid = false;
                }
            });

        } catch (err) {

        }

        if (!formIsValid) {
            //Trigger any summary errors to show.
            $(".validation-summary-valid").addClass("validation-summary-errors").removeClass("validation-summary-valid");
        } else {
            $(".validation-summary-errors").addClass("validation-summary-valid").removeClass("validation-summary-errors");
        }

        return formIsValid;
    };

    var disableCallback = new function () { };
    var enableCallback = new function () { };

    function init(userDisableCallback, userEnableCallback, options) {
        disableCallback = userDisableCallback;
        enableCallback = userEnableCallback;
        var form = $('.mvc-form');
        if (form.length == 0) return; //If there isnt a "Form" then dont continue.
        var data = form.data();
        if (data.preventNavigation == false) return;

        allowSave(false);

        form.find('input:not(.modal-input),select,textarea').not('.dont-allow-save').on('input', function () {
            allowSave(true);
        });
        form.find('input:not(.modal-input),select,textarea').not('.dont-allow-save').on('change', function () {
            allowSave(true);
        });

        $('#save').click(function (e) {
            e.preventDefault();
            if ($('#save').is('[disabled="disabled"]'))
                return;
            window.onbeforeunload = function () { };
            site.submitForm(form, options);
        });

        $.validator.unobtrusive.parse(document);
    };

    function allowSave(isAllowed) {
        if (isAllowed) {
            $('#save').removeAttr('disabled');
            window.onbeforeunload = function () {
                return "All changes will be lost if you do not save.";
            }
            if ($.isFunction(enableCallback)) {
                enableCallback();
            }
        } else {
            window.onbeforeunload = function () { };
            $('#save').attr('disabled', 'disabled');
            if ($.isFunction(disableCallback)) {
                disableCallback();
            }
        }
    }

    return {
        init: init,
        initialize: init,
        allowSave: allowSave,
        isFormValid: isFormValid,
        submitForm: submitForm
    };
}($));

