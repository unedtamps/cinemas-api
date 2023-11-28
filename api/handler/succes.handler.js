class SuccesResponse {
    constructor(message,data){
        this.message = message
        this.data = data
    }

    succes200(res){
        res.status(200).json({
            success: true,
            data:this.data,
        })
    }

    succes201(res){
        res.status(201).json({
            success: true,
            data:this.data,
        })
    }
}
module.exports = {
    SuccesResponse
}