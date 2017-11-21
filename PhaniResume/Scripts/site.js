var site = (function($){
    function getParameterByName() {
        
    }

    function makeDataTable() {
        
    }

    function fixDataTable(api,selector) {
        
    }
    function addpaging(api, selector) {
        
    }

    function moveDisplayPerScreen(selector) {
        
    }

    function updateTableShowing(api, selector) {

        
    }

    function bootstrapSelect(selector) {
        
    }

    function enableCheckListTableStoring(parameters) {
        
    }

    function submitform(theform,options) {
        
    }

    function isFormValid(theForm) {
        site_forms.isFormValid(theForm);
    }

    function relativeUrl(destinationUrl,applicationUrl) {
        
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


}