import {
  Schema,
  Document,
  FilterQuery,
  Model,
  PopulateOptions,
} from 'mongoose';

export interface PaginationOptions {
  sortBy?: string;
  populate?: string;
  limit?: number | string;
  page?: number | string;
}

export interface QueryResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginateModel<T extends Document> extends Model<T> {
  paginate(
    filter?: FilterQuery<T>,
    options?: PaginationOptions,
  ): Promise<QueryResult<T>>;
}

const paginate = <T extends Document>(schema: Schema<T>): void => {
  schema.statics.paginate = async function (
    this: Model<T>,
    filter: FilterQuery<T> = {},
    options: PaginationOptions = {},
  ): Promise<QueryResult<T>> {
    let sort = '';

    if (options.sortBy) {
      const sortingCriteria: string[] = [];
      options.sortBy.split(',').forEach((sortOption: string) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    // Improved input validation with limits
    const limit = Math.min(
      Math.max(
        options.limit && parseInt(options.limit.toString(), 10) > 0
          ? parseInt(options.limit.toString(), 10)
          : 10,
        1,
      ),
      100, // Cap at 100 items per page
    );

    const page = Math.max(
      options.page && parseInt(options.page.toString(), 10) > 0
        ? parseInt(options.page.toString(), 10)
        : 1,
      1,
    );

    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

    if (options.populate) {
      options.populate.split(',').forEach((populateOption: string) => {
        const pathParts = populateOption.split('.');

        if (pathParts.length === 1) {
          // Simple populate case
          docsPromise = docsPromise.populate(pathParts[0]);
        } else {
          // Nested populate case
          const populateObj = pathParts
            .reverse()
            .reduce(
              (
                acc: PopulateOptions | undefined,
                path: string,
              ): PopulateOptions => {
                if (acc === undefined) {
                  return { path };
                }
                return { path, populate: acc };
              },
              undefined,
            ) as PopulateOptions;

          docsPromise = docsPromise.populate(populateObj);
        }
      });
    }

    const docsPromiseExec = docsPromise.exec();

    const [totalResults, results] = await Promise.all([
      countPromise,
      docsPromiseExec,
    ]);
    const totalPages = Math.ceil(totalResults / limit);

    const result: QueryResult<T> = {
      results,
      page,
      limit,
      totalPages,
      totalResults,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return result;
  };
};

export default paginate;
