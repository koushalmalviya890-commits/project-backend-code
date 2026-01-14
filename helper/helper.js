class Helper {
        /**
    * getBearerToken
    * @param {*} requestHeader
    * @returns
    */
    static getBearerToken = async (requestHeader) => {
        const bearerToken = requestHeader.split(" ");
        const token = bearerToken[1];

        return await token;
    };

    /**
    * hashPassword
    * @param {*} originalData
    * @returns
    */

    static hashPassword = async (originalData) => {
        const saltRounds = 10;
        const encryptedData = bcrypt.hashSync(originalData, saltRounds);
        return encryptedData;
    };



    /**
    * successResponse
    * @param {*} dataObject
    * @param {*} message
    * @returns
    */
    static successResponse = (dataObject, message) => {
        return { status: true, message: message, data: dataObject };
    };


  static  errorResponse = (dataObject, message) => {
       return { status: false, message: message, data: dataObject };
  };
}

module.exports = Helper;