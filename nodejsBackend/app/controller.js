const service = require("./services/service");

async function getRecommedations(req, res, next) {

    try {
        let recom = await service.getRecommedations(req);
        res.status(200);
        res.send({
            data: recom,
            status: 200,
            message: "Success"
        });
    } catch (error) {
        next(error);
    }

}

async function getSimilar(req, res, next) {

    try {
        let recom = await service.getSimilar(req);
        res.status(200);
        res.send({
            data: recom,
            status: 200,
            message: "Success"
        });
    } catch (error) {
        next(error);
    }

}

// async function createCampaign(req, res, next) {
//     try {
//       await service.createCampaign(req);
//       res.status(201);
//       res.send({
//         data : {},
//         status : 201,
//         message : "Success"});
//     } catch (error) {
//       next(error);  
//     }
// }

module.exports = {
    getRecommedations
    ,
    getSimilar
};
