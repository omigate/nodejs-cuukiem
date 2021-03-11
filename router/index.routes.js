const express = require("express")
const router = express.Router()
const Event = require("../views/event.ejs")


// home page
router.get('/event', (req, res, next)=>{
  let perPage = 16; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1; 

  Event
    .find() // find tất cả các sản phẩm 
    .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
    .limit(perPage)
    .exec((err, vents) => {
        Event.countDocuments((err, count) => { // đếm để tính xem có bao nhiêu trang
        if (err) return next(err);
        res.render('/event', {
            events, // sản phẩm trên một page
          current: page, // page hiện tại
          pages: Math.ceil(count / perPage) // tổng số các page
        });
      });
    });
})

// pagination
router.get('/event/:page', (req, res, next) => {
  let perPage = 16; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1; 
  
    Event
      .find() // find tất cả các data
      .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
      .limit(perPage)
      .exec((err, events) => {
        Event.countDocuments((err, count) => { // đếm để tính xem có bao nhiêu trang
          if (err) return next(err);
          res.render('/event', {
            events, // sản phẩm trên một page
            current: page, // page hiện tại
            pages: Math.ceil(count / perPage) // tổng số các page
          });
        });
      });
  });



