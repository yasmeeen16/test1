var express = require('express');
var Router = express.Router();
var BodyParser = require('body-parser');
var expressValidato = require('express-validator');
var BodyParserMid = BodyParser.urlencoded();//middle ware to get data from request body
const path = require('path');
const fs = require("fs");
var mongoose = require("mongoose");

var multer = require("multer");
require("../Model/Category");
require("../Model/offer");
require("../Model/vendorData")
var categoryDataModel = mongoose.model("Category");
var   subCategoryModel= mongoose.model("subCategory");
var vendorDataModel=mongoose.model("vendorData");
require("../Model/product");
require("../Model/vendorData");
var productModel = mongoose.model("product");
var vendorModel = mongoose.model("vendorData");
var offerModel = mongoose.model("offer");

var multer = require("multer");//to upload file
var uploadMid = multer({dest:"./public/imgs"});



Router.get('/index',function(req,resp,next){
  // categoryDataModel.find({parent:null},function(err,categories){
  //   resp.render("userlayout/index1.ejs",{categories:categories});
  //   //resp.json({categories:categories});
  // }).sort( { time: 1 } )


  categoryDataModel.find({parent:null},function(err,categories){
    categoryDataModel.populate(categories,{path:"offerID"},function(err,categories){
      resp.render("userlayout/index1.ejs",{categories:categories});
    })

  }).sort( { time: 1 } );
});
Router.get('/category/:catId',function(req,resp,next){
  categoryDataModel.find({parent:null},function(err,categories){
  categoryDataModel.findOne({_id:req.params.catId},function(err,cat){
  if(cat){
    categoryDataModel.findOne({_id:cat.parent},function(err,catp){
      if(catp){
        productModel.find({mainCategory:catp._id},function(err,allproducts){
    categoryDataModel.find({parent:req.params.catId},function(err,categories1){

    resp.render("userlayout/category.ejs",{cat:cat,categories1:categories1,categories:categories,catp:catp,allproducts:allproducts})

  })
  })
  }
  })
}
})
})
})

//add product to category
Router.post("/addproductToCat",BodyParserMid,function(req,resp){
  var vendorId;
  if(!(req.session.status=="vendor")){
      resp.redirect('/wauthvendor/login');
  }else {
    vendorModel.findOne({email:req.session.email},{_id:1},function(err,res){
      vendorId=res._id;
    })
    var imgs = [];
    var str = req.body.url;
    var res = str.split(",");
    //resp.json({res:res});
    imgs=res;

           productModel.find({Aname:req.body.Aname , Ename:req.body.Ename}, function(err, products) {

                              var product = new productModel({
                                Ename:req.body.Ename,
                                Aname:req.body.Aname,
                                modelnumber:req.body.modelnumber,
                                brandArabic:req.body.brandArabic,
                                brandEnglish:req.body.brandEnglish,
                                price1:req.body.price1,
                                price2:req.body.price2,
                                imgs:imgs,
                                vendorId:vendorId,
                                catId:req.body.catId,
                                offerId:req.body.offerId,
                                discount:req.body.discount,
                                discriptionEnglish:req.body.discriptionEnglish,
                                discriptionArabic:req.body.discriptionArabic,
                                tagsArabic:req.body.tagsArabic,
                                tagsEnglish:req.body.tagsEnglish,
                                freeshipping:req.body.freeshipping,
                                heighlightEnglish:req.body.heighlightEnglish,
                                heighlightArabic:req.body.heighlightArabic,
                                specificationEnglish:req.body.specificationEnglish,
                                specificationArabic:req.body.specificationArabic,
                                quantity:req.body.quantity,
                                status:req.body.status,
                                time:Date.now()
                              });//object of product
                              product.save(function(err) {
                                    if(err){
                                        //resp.redirect("/webadmin/addproductToCat/"+req.params.catId);
                                        console.log(err);
                                        return;
                                      }else
                                      resp.redirect('/webvendor/productvendor');
                                      //resp.json({  product :  product});

                                    });//save the object

                        });
}

});


Router.get('/productvendor',function(req,resp,next){
  if(!(req.session.status=="vendor")){
      resp.redirect('/wauthvendor/login');
  }else {
    vendorModel.findOne({email:req.session.email},{_id:1},function(err,res){
      //vendorId=res._id;
      productModel.find({vendorId:res._id},{},function(err,products){
          resp.render("content/productsvendor.ejs",{products:products});
      })
    })
      //console.log(cat.Ename);

    }

});
Router.get('/logout',function(req,resp,next){
  req.session.destroy(function(){
    resp.redirect('/wauthvendor/login');
  });

});
module.exports=Router;
