using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ServiceLayer.Services;

namespace PhaniResume.Controllers
{
    public class PhaniResumeController : Controller
    {
        private readonly IResumeService _resumeService;

        public PhaniResumeController(IResumeService resumeService)
        {
            _resumeService = resumeService;
        }


        // GET: PhaniResume
        public ActionResult GetCustomerDetails()
        {
            var s = _resumeService.GetcustomerByCustomer(1);
            return View("CustomerDetails",s);
        }

        public ActionResult GetResumeDetailsSummary(int customerId)
        {
            var s = _resumeService.GetcustomerByCustomer(customerId);
            return PartialView("GetResumeDetailsSummary", s);
        }

        public ActionResult GetNewResume(int customerId)
        {
            var s = _resumeService.GetcustomerByCustomer(customerId);
            return PartialView("GetResumeDetailsSummary", s);
        }
    }
}