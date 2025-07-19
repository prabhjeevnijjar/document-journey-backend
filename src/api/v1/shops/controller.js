const httpStatus = require('http-status');
const Shops = require('./shopdetails.model');
const { success, error } = require('../../../helper/response');

/**
 * Get all shops list acc to filter specified
 * @public
 */
exports.getAllShops = async (req, res, next) => {
  try {
    const { page = 0, limit = 5 } = req.query;
    let { sort = 'starRating' } = req.query;
    sort ? (sort = sort.split(',')) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) sortBy[sort[0]] = sort[1];
    else sortBy[sort[0]] = -1;

    const result = await Shops.find()
      .where('isVisible')
      .equals(true)
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    const totalDocs = await Shops.countDocuments()
      .where('isVisible')
      .equals(true)
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    res.status(httpStatus.OK).json(
      success({
        message: 'Fetch success!',
        error: false,
        code: httpStatus.FOUND,
        results: { result, totalDocs },
      })
    );
  } catch (error) {
    return next(error);
  }
};

exports.getAllNearestShops = () => {
  console.log('hello world');
};

exports.getAllMenuItems = () => {
  console.log('hello world');
};

/**
 * Creates a new shop if shop name already does not exists
 * @public
 */
exports.addNewShop = async (req, res, next) => {
  try {
    const { shopName, coordinates, images, menuItems, isVisible } = req.body;
    // We should add validations here for each items, since this is dummy data I am not doing any validations
    const isShopExists = await Shops.findOne({ shopName });

    if (isShopExists) {
      res.status(httpStatus.CONFLICT).json(
        error({
          message: 'Shop name already taken. Please use new shop name.',
          error: true,
          code: httpStatus.CONFLICT,
        })
      );
      throw new Error({
        message: 'Email address is already exists.',
        status: httpStatus.CONFLICT,
      });
    }

    await new Shops({
      shopName,
      coordinates,
      images,
      menuItems,
      isVisible,
    }).save();

    res.status(httpStatus.CREATED).json(
      success({
        message: 'New shop added',
        error: false,
        code: httpStatus.CREATED,
        results: {},
      })
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Search all the existing shops in DB and returns the matching query
 * @public
 */
exports.searchShops = async (req, res, next) => {
  try {
    const searchQuery = req.query.query;

    const pipeline = [];
    // pipeline.push({
    //   $match: { isVisible: true },
    // });
    if (searchQuery) {
      pipeline.push({
        $search: {
          index: 'shop_search',
          text: {
            query: searchQuery,
            path: ['shopName', 'description'],
            fuzzy: {},
          },
        },
      });

      pipeline.push({
        $project: {
          _id: 1,
          score: { $meta: 'searchScore' },
          shopName: 1,
          images: 1,
        },
      });

      const result = await Shops.aggregate(pipeline);

      res.status(httpStatus.OK).json(
        success({
          message: 'Fetch success!',
          error: false,
          code: httpStatus.FOUND,
          results: { result },
        })
      );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get the particular coffe shop details by _Id
 * @public
 */
exports.getShopById = async (req, res, next) => {
  try {
    const result = await Shops.findOne({ _id: req.query.id })
      .where('isVisible')
      .equals(true);

    if (result) {
      res.status(httpStatus.OK).json(
        success({
          message: 'Fetch success!',
          error: false,
          code: httpStatus.FOUND,
          results: result,
        })
      );
    } else {
      res.status(httpStatus.OK).json(
        success({
          message: 'Not found!',
          error: false,
          code: httpStatus.NOT_FOUND,
          results: result,
        })
      );
    }
  } catch (error) {
    next(error);
  }
};
