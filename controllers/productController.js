import { pid } from "process";
import ProductModel from "../models/ProductModel.js"
import fs from 'fs';

export const createProductCotroller = async (req, res) => {
    try {
        const { place,price, area, bedroom, bathroom, hospital, school } = req.fields
        const { photo } = req.files
        
        switch (true) {
          case !place:
            return res.status(500).send({ error: "Place is Required" });
          case !price:
            return res.status(500).send({ error: "Price is Required" });
          case !area:
            return res.status(500).send({ error: "Area is Required" });
          case !bedroom:
            return res
              .status(500)
              .send({ error: "No. of bedrooms is Required" });
          case !bathroom:
            return res
              .status(500)
              .send({ error: "No. of bathroom is Required" });
          case !hospital:
            return res
              .status(500)
              .send({ error: "No. of hospital is Required" });
          case !school:
            return res
                .status(500)
                .send({ error: "No. of school is Required" });
          case photo && photo.size > 1000000:
            return res
              .status(500)
              .send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = new ProductModel({ ...req.fields })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save();
         res.status(201).send({
           success: true,
           message: "Product Created Successfully",
           products,
         });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in creating product"
        })
    }
}

export const getProductController = async(req,res) => {
     try {
         const products = await ProductModel.find({}).select("-photo").limit(12).sort({ createdAt: -1 })
         res.status(200).send({
             success: true,
             message:"All Products",
             products,
         })
     } catch (error) {
         console.log(error)
         res.status(500).send({
             success: true,
             message:"Error in getting product"
         })
     }
}


// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await ProductModel
      .findById(req.params.pid)
      .select("-photo")
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

export const productPhotoController = async(req,res) => {
    try {
        
        const product = await ProductModel.findById(req.params.pid).select(
          "photo"
        );
        if (product.photo.data) {
            res.set("content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message :"Photo not found",
        })
    }
}

export const deleteProductController = async(req,res) => {
    try {
        await ProductModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
          success: true,
          message:"Deleted successfully"
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message:"Not deleted"
        })
    }
}

export const updateProductController = async (req, res) => {
  try {
    const { place, price, area, bedroom, bathroom, hospital, school } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !place:
        return res.status(500).send({ error: "Place is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !area:
        return res.status(500).send({ error: "Area is Required" });
      case !bedroom:
        return res.status(500).send({ error: "No. of bedrooms is Required" });
      case !bathroom:
        return res.status(500).send({ error: "No. of bathroom is Required" });
      case !hospital:
        return res.status(500).send({ error: "No. of hospital is Required" });
      case !school:
        return res.status(500).send({ error: "No. of school is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

      const products = await ProductModel.findByIdAndUpdate(
        req.params.pid,
        { ...req.fields},
        { new: true }
      );
    
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating product",
    });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { radio, bedroom } = req.body;
    let args = {};

    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    if (bedroom) args.bedroom = bedroom;
    //if (area.length) args.area = { $gte: area[0], $lte: area[1] };
    // if (area) {
    //   if (area === "small") args.area = { $lte: 500 };
    //   else if (area === "medium") args.area = { $gt: 500, $lte: 1000 };
    //   else if (area === "large") args.area = { $gt: 1000 };
    // }

    const products = await ProductModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await ProductModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await ProductModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

export const productLikeController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "Product not found" });
    }
    product.likes = product.likes + 1;
    await product.save();
    res.status(200).send({ success: true, likes: product.likes });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error while liking product", error });
  }
}
