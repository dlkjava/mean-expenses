const Receipt = require("../models/receipt");

exports.createReceipt = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const receipt = new Receipt({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  receipt
    .save()
    .then(createdReceipt => {
      res.status(201).json({
        message: "Receipt added successfully",
        receipt: {
          ...createdReceipt,
          id: createdReceipt._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a receipt failed!"
      });
    });
};

exports.updateReceipt = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const receipt = new Receipt({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Receipt.updateOne({ _id: req.params.id, creator: req.userData.userId }, receipt)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate receipt!"
      });
    });
};

exports.getReceipts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const receiptQuery = Receipt.find();
  let fetchedReceipts;
  if (pageSize && currentPage) {
    receiptQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  receiptQuery
    .then(documents => {
      fetchedReceipts = documents;
      return Receipt.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: "Receipts fetched successfully!",
        receipts: fetchedReceipts,
        maxReceipts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching receipts failed!"
      });
    });
};

exports.getReceipt = (req, res, next) => {
  Receipt.findById(req.params.id)
    .then(receipt => {
      if (receipt) {
        res.status(200).json(receipt);
      } else {
        res.status(404).json({ message: "Receipt not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching receipt failed!"
      });
    });
};

exports.deleteReceipt = (req, res, next) => {
  Receipt.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting receipts failed!"
      });
    });
};
