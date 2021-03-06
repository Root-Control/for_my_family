'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  translate = require('google-translate-api'),
  cassandra = require('express-cassandra'),
  Article = cassandra.instance.Articles,
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an article
 */
exports.create = async (req, res) => {
  let article = new Article(req.body);
  article.created = new Date();
  article.user = 'any user';

  article.save(err => {
      if(err) return res.status(422).send({ message: errorHandler.getErrorMessage(err) }); 
      else {
        console.log(article);
        res.json(article);
      }
  });   
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
  var article = req.article ? req.article.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  article.isCurrentUserOwner = !!(req.user && article.user && article.user.id.toString() === req.user.id.toString());

  res.json(article);
};

/**
 * Update an article
 */
exports.update = async (req, res) => {
  let article = req.article;

  Article.update({ id: article.id }, req.body, (err, result) => {
    if(err) return res.status(422).send({ message: errorHandler.getErrorMessage(err) });
    else res.json(req.body);
  });
};

/**
 * Delete an article
 */
exports.delete = async (req, res) => {
  let article = req.article;
  Article.delete({ id: article.id }, (err, result) => {
    console.log(result);
    if(err) return res.status(422).send({ message: errorHandler.getErrorMessage(err) });
    else res.json(article);
  });
};

/**
 * List of Articles
 */
exports.list = async (req, res) => {
  Article.find({}, { allow_filtering: true }, (err, articles) => {
    if(err) return res.status(422).send({ message: errorHandler.getErrorMessage(err) });
    else res.json(articles);
  });
};

/**
 * Article middleware
 */
exports.articleByID = async (req, res, next, id) => {
  Article.findOne({ id: id }, (err, article) => {
    if(!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });       
    }
    req.article = article;
    next();
  });
};
          