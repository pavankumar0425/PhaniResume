ResumeDetials = (function ($) {
    var applicationPathGlobal = "Not Set";
    var savedSettings;
    var savedcollectionPasswordSettings;
    var customerId;
    var load = function (settings) {
        debugger;
        if (settings) {

            $("#Resume-Details-Summary").html(site.loadingMessage("Resune Details"));
            $.ajax({
                url: site.doNotCacheQueryString(site.relativeUrl("/PhaniResume/GetResumeDetailsSummary" + "?customerID=" + settings.customerId, applicationPathGlobal)),
                type: "GET",
                cache: "false",
                contentType: 'application/json; charset=utf-8',
                success: function (response) {
                    $("#Resume-Details-Summaryy").html(""); // Clean up
                    $("#Resume-Details-Summary").html(response);
                    $("#Resume-Details-Summary-Table .previous, #Resume-Details-Summary-Table .next, #Resume-Details-Summary-Table .go-to-pagining").click(function () {
                        loadCollectiionPasswordEvents(savedcollectionPasswordSettings);
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $("#Resume-Details-Summary").html(site.defaultSiteErrorText);
                }
            });
        };
    };
    var init = function (settings) {
        applicationPathGlobal = settings.applicationPath;
        savedSettings = settings;
        customerId = settings.customerId;
        load(settings);
    };

    function loadCollectiionPasswordEvents(collectionPasswordSettings) {
        savedcollectionPasswordSettings = collectionPasswordSettings;
        $("[update-collection-password]").on("click", function () {
            var _data = $(this).data();
            var imageId = _data.imageid;
            var collectionPasswordId = _data.collectionpasswordid;
            var url = site.doNotCacheQueryString(collectionPasswordSettings.UpdateCollectionPasswordUrl +
                "?imageId=" + imageId + "&collectionPasswordId=" + collectionPasswordId);
            $.get(url, function (data) {
                site.modal.show({
                    title: "Edit Collection Password",
                    msg: data,
                    hideOnButtonClick: false,
                    buttonsToCreate: [
                        {
                            cssClass: "btn btn-primary",
                            value: "Save",
                            clickHandler: function () {
                                site.submitForm($("#Edit-Collection-Password-Form"), {
                                    async: false
                                });
                            },
                            btnWidth: "120px"
                        },
                        {
                            cssClass: "btn btn-primary",
                            value: "Cancel",
                            clickHandler: function () {
                                site.modal.hide();
                            },
                            btnWidth: "120px"
                        }
                    ]
                });
            });
        });


        $("[delete-resume]").on("click",
            function () {
                var data = {
                    imageId: $(this).data().imageid,
                    collectionPasswordId: $(this).data().collectionpasswordid
                };
                site.modal.show({
                    title: "Delete Collection Password",
                    msg: "Are you sure you wish to delete this collection password?",
                    hideOnButtonClick: false,
                    buttonsToCreate: [
                        {
                            cssClass: "btn btn-primary",
                            value: "Okay",
                            clickHandler: function () {
                                $.ajax({
                                    url: site.doNotCacheQueryString(collectionPasswordSettings.DeleteCollectionPasswordUrl),
                                    data: JSON.stringify(data),
                                    type: "POST",
                                    cache: "false",
                                    contentType: 'application/json; charset=utf-8',
                                    success: function (response) {
                                        site.modal.hide();
                                        $("#Collection-Password-Summary").html(""); // Clean up
                                        $("#Collection-Password-Summary").html(response);
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        $("#Collection-Password-Summary").html(site.defaultSiteErrorText);
                                    }
                                });
                            },
                            btnWidth: "120px"
                        },
                        {
                            cssClass: "btn btn-primary",
                            value: "Cancel",
                            clickHandler: function () {
                                site.modal.hide();
                            },
                            btnWidth: "120px"
                        }
                    ]
                });
            });
        $("#AddNewResume").on("click",
            function () {
                var _data = $(this).data();
                var imageId = _data.imageid;
                var url = site.doNotCacheQueryString(collectionPasswordSettings.AddCollectionPasswordUrl +
                    "?imageId=" + imageId);
                $.get(url, function (data) {
                    site.modal.show({
                        title: "Add collection password",
                        msg: data,
                        hideOnButtonClick: false,
                        buttonsToCreate: [
                            {
                                cssClass: "btn btn-primary",
                                value: "Save",
                                clickHandler: function () {
                                    site.submitForm($("#Add-Collection-Password-Form"), {
                                        async: false
                                    });
                                },
                                btnWidth: "120px"
                            },
                            {
                                cssClass: "btn btn-primary",
                                value: "Cancel",
                                clickHandler: function () {
                                    site.modal.hide();
                                },
                                btnWidth: "120px"
                            }
                        ]
                    });
                });
            });
    }
    function customNewHandler(data) {
        debugger;

        if ($(data).find("#Add-Collection-Password-Form-Div").length > 0) {
            $("#Add-Collection-Password-Form").html("").html(data);
        }
        else if ($(data).find("#Edit-Collection-Password-Form-Div").length > 0) {
            $("#Edit-Collection-Password-Form").html("").html(data);
        }
        else {
            site.modal.hide();
            $("#Collection-Password-Summary").html(data);
            $("#collection-password-summary-table .previous, #collection-password-summary-table .next, #collection-password-summary-table .go-to-pagining").click(function () {
                loadCollectiionPasswordEvents(savedcollectionPasswordSettings);
            });
        };
    };


    return {
        init: init,
        loadCollectiionPasswordEvents: loadCollectiionPasswordEvents,
        customNewHandler: customNewHandler
    };

}($)); 