import { Schema, Document, SchemaType, Model } from 'mongoose';

// Define types for better type safety
interface TransformFunction {
  (doc: Document, ret: any, options: any): any;
}

interface ToJSONOptions {
  virtuals?: boolean;
  versionKey?: boolean;
  transform?: TransformFunction;
}

const deleteAtPath = (obj: any, path: string[], index: number): void => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  if (obj[path[index]]) {
    deleteAtPath(obj[path[index]], path, index + 1);
  }
};

// Make the plugin function generic to work with any schema type
const toJSON = <T extends Document = Document, M extends Model<T> = Model<T>>(
  schema: Schema<T, M>,
): void => {
  let transform: TransformFunction | undefined;

  // Get existing transform function the same way as JS version
  const existingToJSON = (schema as any).options.toJSON;
  if (existingToJSON && existingToJSON.transform) {
    transform = existingToJSON.transform;
  }

  // Directly assign to schema.options.toJSON like the JS version
  (schema as any).options.toJSON = Object.assign(existingToJSON || {}, {
    transform(doc: Document, ret: any, options: any): any {
      // Remove private fields
      const schemaPaths = schema.paths as Record<
        string,
        SchemaType & { options?: any }
      >;

      Object.keys(schemaPaths).forEach((path) => {
        const schemaPath = schemaPaths[path];
        if (schemaPath?.options && schemaPath.options.private) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      // Rename _id to id
      ret.id = ret._id.toString();
      // delete ret.createdAt;
      delete ret.updatedAt;
      delete ret._id;
      delete ret.__v;

      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};

export default toJSON;
