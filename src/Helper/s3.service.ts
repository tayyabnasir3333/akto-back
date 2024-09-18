import * as AWS from "aws-sdk";
// import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import { config } from "../config/configBasic";

class S3Service {
  AWS_S3_BUCKET = config.Aws.bucket_name;
  s3 = new AWS.S3({
    accessKeyId: config.Aws.access_key,
    secretAccessKey: config.Aws.secret_key,
    region: "ap-northeast-1",
  });
  DEFAULT_EXPIRATION_TIME = 60;
  async uploadFile(file: any, uuid: any, folderName?: string): Promise<any> {
    const filePath = `${config.Aws.bucket_name}/${folderName}`;
    console.log(file);
    await this.s3_upload(
      file.buffer,
      filePath,
      uuid || file.originalName,
      file.mimetype || file.fileType?.mime,
    );
    return {
      uuid: uuid,
      originalName: file.originalName,
      fileType: file.fileType,
      size: file.size,
      encoding: file.encoding,
    };
  }

  async createBucket(bucketName: string) {
    const params = {
      Bucket: bucketName + "-keywest",
    };
    return await this.s3.createBucket(params, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log("Bucket Created Successfully", data.Location);
    });
  }

  getPreSignedUrl(
    key: string,
    folderName?: string,
    expirationTime?: number,
  ): string {
    const filePath = `${config.Aws.bucket_name}/${folderName}`;
    const finalExpirationTime = expirationTime || this.DEFAULT_EXPIRATION_TIME;

    return this.s3.getSignedUrl("getObject", {
      Bucket: filePath,
      Key: key,
      Expires: finalExpirationTime,
    });
  }

  private async s3_upload(
    file: any,
    bucket: string,
    name: string,
    mimetype: string,
  ): Promise<string> {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: mimetype,
    };

    const s3Response = await this.s3.upload(params).promise();
    return name;
  }

  async deleteFile(folderName:string, uuid:string){
    const params = {
      Bucket:config.Aws.bucket_name!,
      Key: String(`${folderName}/${uuid}`),
    };

    return await this.s3.deleteObject(params).promise();
  }
}
export default new S3Service();
