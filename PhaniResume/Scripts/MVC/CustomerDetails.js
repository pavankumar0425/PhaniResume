CuatomerDetails = (function ($) {
    var applicationPathGlobal = "Not Set";
    var savedSettings;
    var savedcollectionPasswordSettings;
    var imageId;
    var load = function (settings) {
        if (settings) {

            $("#Collection-Password-Summary").html(site.loadingMessage("Collection Password"));
            $.ajax({
                url: site.doNotCacheQueryString(site.relativeUrl("/Tracking/Collection/GetCollectionPasswordsByCollectionId" + "?imageId=" + settings.imageID, applicationPathGlobal)),
                type: "GET",
                cache: "false",
                contentType: 'application/json; charset=utf-8',
                success: function (response) {
                    $("#Collection-Password-Summary").html(""); // Clean up
                    $("#Collection-Password-Summary").html(response);
                    $("#collection-password-summary-table .previous, #collection-password-summary-table .next, #collection-password-summary-table .go-to-pagining").click(function () {
                        loadCollectiionPasswordEvents(savedcollectionPasswordSettings);
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $("#Collection-Password-Summary").html(site.defaultSiteErrorText);
                }
            });
        };
    };
    var init = function (settings) {
        applicationPathGlobal = settings.applicationPath;
        load(settings);
        savedSettings = settings;
        imageId = settings.imageID;
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


        $("[delete-collection-password]").on("click",
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
        $("#AddCollectionPassword").on("click",
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

    function loadCustomerDetails (settings) {
        ResumeDetials.init(settings);
    }        
    return {
        init: init,
        loadCollectiionPasswordEvents: loadCollectiionPasswordEvents,
        customNewHandler: customNewHandler,
        loadCustomerDetails: loadCustomerDetails
    };

}($)); 