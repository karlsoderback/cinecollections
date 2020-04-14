module.exports.createSuccessResponse = function (res){
    res.status(200).send("The request was succesful");
}

module.exports.createFailResponse = function (res){
    res.status(403).send("Something went wrong");
}

module.exports.createUnauthorizedResponse = function (res){
    res.status(403).send("Unauthorized");
}
