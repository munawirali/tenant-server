const con = {
  host: `localhost`,
  port: 5432,
  database: `${process.env.APP_DB}`,
  user: `${process.env.APP_USER}`,
  password:`${process.env.APP_PASSWORD}`
}
const pgp = require('pg-promise')();
const db = pgp(con);
// const uploadLogo = require('../helper/azure_upload');

class TenantCompany {
  static async findAll(){
    try {
      const response = await db.any('SELECT * FROM tenant_company ORDER BY company_id')
      return response
    } catch (err) {
      return(err);
    }
  }
  static async findById(id){
    try {
      const response = await db.any('SELECT * FROM tenant_company WHERE company_id=$1', [id])
      return response
    } catch (err) {
      return(err);
    }
  }
  static async updateLogoUrl(id,logo_url){
    try {
      await db.any('UPDATE tenant_company SET logo_url=$1 WHERE company_id=$2', [`${logo_url}`,id])
      return id
    } catch (err) {
      console.log(err);
      return err;
    }
  }
  static async removeLogoUrl(id){
    try {
      await db.any('UPDATE tenant_company SET logo_url=$1 WHERE company_id=$2', [null,id])
      return id
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
module.exports = TenantCompany
