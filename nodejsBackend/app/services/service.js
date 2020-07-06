const _ = require('lodash')
var moment = require('moment-timezone')
var Request = require('../proxies/request')
var {formDataDao} = require('../repository')

async function getRecommedations(req) {
    console.log('in service')
    let preRes = JSON.parse(
        await Request.getRequest(
            {},
            'http://10.105.16.200:5000/prep?q=' + req.query.q
        )
    )

    let titleStr = ''
    let appendStr = 'q=('
    let rangeStr = ''
    let descStr = ''
    let returnResp = {
        intent: {},
        solr: {},
        categories: [],
        meta: [],
        color: [],
        brand: []
    }

    let repoRes = await formDataDao.getAllFormData(_.map(preRes.query).join(' '))
    if (repoRes.length === 0) {
        if (preRes.query.length > 1) {
            repoRes = await formDataDao.getAllFormData(preRes.query[0]);
        }
        if (repoRes.length === 0) {
            if (preRes.query.length > 1) {
                repoRes = await formDataDao.getAllFormData(preRes.query[1]);
            }
        }
    }
    console.log(repoRes.length);
    if (repoRes.length > 0 && repoRes.length <= 10) {
        _.each(repoRes, (ele, i) => {
            if (returnResp.brand.indexOf(ele.brand) < 0) {
                returnResp.brand.push(ele.brand);
            }
            if (returnResp.meta.indexOf(ele.meta_n) < 0) {
                returnResp.meta.push(ele.meta_n);
            }
            if (returnResp.categories.indexOf(ele.category) < 0) {
                returnResp.categories.push(ele.category);
            }
            if (returnResp.color.indexOf(ele.color_slug) < 0) {
                returnResp.color.push(ele.color_slug);
            }

            ele.meta_n = ele.meta_n.replace(/&/g, '')
            appendStr += `(brand: "${ele.brand}")^${ele.b_in} or (color_slug: "${
                ele.color_slug
            }")^${ele.c_in} or (category: "${ele.category}")^${
                ele.cat_in
            } or (meta: "${ele.meta_n}")^${ele.m_in}`

            if (i != repoRes.length - 1) {
                appendStr += ' or '
            }
        })
        appendStr += ')'
        let solrUrl =
            'http://10.105.24.217:7575/solr/zappos-us_product/select?' +
            appendStr +
            '&sort=score desc'
        //   console.log(solrUrl)
        let res = JSON.parse(await Request.getRequest({}, solrUrl))
        returnResp.intent = res.response
    } else if (repoRes.length > 10) {
        console.log("in else");

        let finalArray = [];
        let orderData = _.orderBy(repoRes, 'b_in', 'desc');
        let temData = orderData.slice(0, 5)
        console.log(temData.length);
        finalArray = finalArray.concat(temData);
        console.log(finalArray.length);
        orderData = _.orderBy(repoRes, 'c_in', 'desc');
        temData = orderData.slice(0, 5)
        finalArray = finalArray.concat(temData);
        console.log(finalArray.length);
        orderData = _.orderBy(repoRes, 'meta_n', 'desc');
        temData = orderData.slice(0, 5)
        finalArray = finalArray.concat(temData);
        console.log(finalArray.length);
        orderData = _.orderBy(repoRes, 'cat_in', 'desc');
        temData = orderData.slice(0, 5)
        finalArray.concat(temData);
        console.log(finalArray.length);

        finalArray = finalArray.slice(0, 10)

        console.log("finalArray : ", finalArray);

        _.each(finalArray, (ele, i) => {
            if (returnResp.brand.indexOf(ele.brand) < 0) {
                returnResp.brand.push(ele.brand);
            }
            if (returnResp.meta.indexOf(ele.meta_n) < 0) {
                returnResp.meta.push(ele.meta_n);
            }
            if (returnResp.categories.indexOf(ele.category) < 0) {
                returnResp.categories.push(ele.category);
            }
            if (returnResp.color.indexOf(ele.color_slug) < 0) {
                returnResp.color.push(ele.color_slug);
            }

            ele.meta_n = ele.meta_n.replace(/&/g, '')
            appendStr += `(brand: "${ele.brand}")^${ele.b_in} or (color_slug: "${
                ele.color_slug
            }")^${ele.c_in} or (category: "${ele.category}")^${
                ele.cat_in
            } or (meta: "${ele.meta_n}")^${ele.m_in}`

            if (i != finalArray.length - 1) {
                appendStr += ' or '
            }
        })
        appendStr += ')'
        let solrUrl =
            'http://10.105.24.217:7575/solr/zappos-us_product/select?' +
            appendStr +
            '&sort=score desc'
        //   console.log(solrUrl)
        let res = JSON.parse(await Request.getRequest({}, solrUrl))
        returnResp.intent = res.response
    }
    titleStr = ''
    appendStr = 'q=('
    rangeStr = ''
    descStr = ''
    if (!_.isNil(preRes.range) && _.isNumber(preRes.range)) {
        appendStr =
            'fq=mrp:[' +
            Number(preRes.range * 0.5) +
            'TO' +
            Number(preRes.range * 1.5) +
            ']&' +
            appendStr
    }
    preRes.query.forEach(function (ele, i) {
        if (i == 0) {
            titleStr += '((title:' + ele + ')'
        } else if (i > 0) {
            titleStr += ' and (title:' + ele + ')'
        }

        if (i == preRes.query.length - 1) {
            titleStr += ')^5)'
        }
    })

    preRes.query.forEach(function (ele, i) {
        if (i == 0) {
            descStr += '(((description:' + ele + ')'
        } else if (i > 0) {
            descStr += ' and (description:' + ele + ')'
        }

        if (i == preRes.query.length - 1) {
            descStr += ')^4)'
        }
    })
    appendStr += titleStr + ' or ' + descStr
    if (!_.isEmpty(preRes.gender) && !_.isEmpty(preRes.color)) {
        if (!_.isEmpty(appendStr)) {
            appendStr + ' or '
        }
        appendStr +=
            '(((color_slug:' +
            preRes.color +
            ') or (gender:' +
            preRes.gender +
            '))^=3)'
    } else if (!_.isEmpty(preRes.gender)) {
        appendStr += ' or ((gender:' + preRes.gender + ')^3)'
    } else if (!_.isEmpty(preRes.color)) {
        appendStr += ' or ((color_slug:' + preRes.color + ')^3)'
    }

    let solrUrl =
        'http://10.105.24.217:7575/solr/zappos-us_product/select?' +
        appendStr +
        '&sort=score desc'
    // console.log(solrUrl)

    let res = JSON.parse(await Request.getRequest({}, solrUrl))
    returnResp.solr = res.response
    return returnResp
}

// async function createCampaign(request) {
//   let { body } = request;

//   let item = JSON.parse(JSON.stringify(body));
//   let cleanItem = {};
//   let hashObj = {
//     channel: body.channel,
//     campaignType: body.campaignType,
//     product: body.product,
//     phase: body.phase,
//     touch: body.touch
//   };

//   item.userId = request.payload._id;
//   let user = await userDao.getUserProfile(request);
//   item.userEmail = user.email;
//   item.createTimestamp = moment()
//     .tz("America/New_York")
//     .format();
//   item.campaignId = hash(hashObj);
//   if (!_.isNil(body.deploymentDate) && body.deploymentDate !== "") {
//     item.deploymentDate = moment(body.deploymentDate)
//       .tz("America/New_York")
//       .format();
//     let temp = JSON.parse(JSON.stringify(item));
//     cleanItem = _.omit(temp, ["_id"]);
//   } else {
//     cleanItem = _.omit(item, ["deploymentDate", "touch", "_id"]);
//   }

//   return campaignsDao.createCampaign(cleanItem);
// }


async function getSimilar(req) {
    console.log('in service')


    let solrUrl = `http://10.105.24.217:7575/solr/zappos-us_product/select?q=((color_slug:${req.query.color}) or (category:${req.query.category}) or (brand:${req.query.brand}))&sort=score desc`
    console.log(solrUrl)

    let res = JSON.parse(await Request.getRequest({}, solrUrl))
    return res.response
}


module.exports = {
    getRecommedations,
    getSimilar
}
