const tenant_company = require('../models/tenant_company');
const azure = require('azure-storage');
const blobService = azure.createBlobService(`${process.env.AZURE_ACCOUNT}`,`${process.env.AZURE_KEY}`);
const streamLength = require('stream-length');
const streamifier = require('streamifier');
var hostName = 'https://mystorageaccountname.blob.core.windows.net';

class TenantCompany {
  static async findAll(req,res){
    try {
      const response = await tenant_company.findAll()
      res.status(200).json({
        message: 'Data founded',
        data:response
      })
    } catch (e) {
      res.status(400).json(e)
    }
  }
  static async findById(req, res){
    try {
      const response = await tenant_company.findById(req.params.id)
      res.status(200).json({
        message: 'Data founded',
        data: response
      })
    } catch (e) {
      res.status(400).json(e)
    }
  }
  static async updateLogoUrl(req, res){
    // blobService.listBlobsSegmented('images',null,(err,result,response) => {
    //   console.log('asdfasdfas');
    //   if (err) {
    //     console.log(err)
    //     res.send(err)
    //   } else {
    //     res.send(result)
    //   }
    // })

    try {
      const responseGetData = await tenant_company.findById(req.params.id)
      //convert buffer to stream using streamifier
      const logo =  streamifier.createReadStream(responseGetData[0].logo)
      // console.log(logo);
      const blob_name = 'images'+req.params.id+'.png'
      // res.status(200).json(logo)

      let promUpload = () => new Promise((resolve,reject) => {
        blobService.createBlockBlobFromStream(process.env.AZURE_CONTAINER, blob_name, logo, 1000000, (error) => {
          if (error) {
             console.log(error);
             reject(error)
            // res.status(400).json(error)
          } else {
            resolve( {
            status: 'succes',
            logo_url: blobService.getUrl(process.env.AZURE_CONTAINER,blob_name, null, hostName)
             })
          }
        })
      })
      const responseUpload = await promUpload()
      // console.log(logo_url);
      if (responseUpload.status) {
        const updateBBUrl = await tenant_company.updateLogoUrl(req.params.id,responseUpload.logo_url)
        console.log(responseUpload.logo_url);
        res.status(200).json({
          message: 'Data updated',
          data: responseUpload.logo_url
        })
      } else {
        res.status(400).json(responseUpload)
      }
    } catch (e) {
      res.status(400).json(err)
    }
  }
  static async removeLogoUrl(req,res) {
    let promRemove = () => new Promise((resolve,reject) => {
        blobService.deleteBlobIfExists(process.env.AZURE_CONTAINER, 'images'+req.params.id+'.png', function(error, result) {
          if (error) {
            // Delete blob failed
            console.log(error);
            reject(error)
          } else {
            // Delete blob successfully
            console.log(result);
            resolve(result)
          }
        })
      })

    const removeLogoStorage = await promRemove()
    if (removeLogoStorage) {
      const removeLogoDB = await tenant_company.removeLogoUrl(req.params.id)
      // console.log('asdfasdf',removeLogoDB);
      if (removeLogoDB===req.params.id) {
        res.status(200).json({
          message:'remove logo url successfully',
          data:removeLogoDB.id
        })
      } else {
        res.status(400).json({
          message:'No logo removed'
        })
      }
    } else {
      res.status(400).json({
        message:'No logo removed'
      })
    }
  }
}

module.exports = TenantCompany
