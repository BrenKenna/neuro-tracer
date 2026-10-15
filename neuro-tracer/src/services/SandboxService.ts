// Data stores
export const Stores = {
    Books: "Books",
    Authors: "Authors" 
} as const;

export type Stores = (typeof Stores)[keyof typeof Stores];


// Data store action
const StoreAction = {
    PUT: "Put",
    GET: "Get"
} as const;

type StoreAction = (typeof StoreAction)[keyof typeof StoreAction];


/**
 * Referential data model for DB
 */
export interface DbRecord {
    id?: number;
}


/**
 * Book data model
 */
export interface Book extends DbRecord {
    title: string;
    authorId?: number;
    genre: string;
}


/**
 * Author data model
 */
export interface Author extends DbRecord {
    firstName: string;
    lastName: string;
}


/**
 * Model for transaction operation
 * 
 */
interface DbTransaction {
    transaction: IDBTransaction;
    resp: IDBRequest;
}


/**
 * Service class for interacting with sandbox database
 * 
 */
export class SandboxService {

    // Attributes
    private version:            number;
    private dbPromise:          Promise<IDBDatabase>;
    private readonly STORES:    typeof Stores;
    private readonly dbName:    string;


    /**
     * Constructor signature with default "SandboxDB" label
     */
    constructor();


    /**
     * Construct signature with database name
     * 
     * @param dbName - database name
     */
    constructor(dbName: string);


    /**
     * Construct signature with database name
     * 
     * @param dbName - database name
     * @param version - database version
     */
    constructor(dbName: string, version: number);


    /**
     * Construct with database name
     * 
     * @param dbName - database name
     * @param version - database version
     */
    constructor(dbName = "SandboxDB", version = 1) {
        this.dbName = dbName;
        this.STORES = Stores;
        this.version = version;
        this.dbPromise = this.initDB();
    }


    /**
     * Fetch database name
     * 
     * @returns Database name
     */
    public getDbName(): string {
        return this.dbName;
    }


    /**
     * Get database version
     * 
     * @returns database version
     */
    public getDbVersion(): number {
        return this.version;
    }


    /**
     * Initialize database
     * 
     * @returns {IDBDatabase} resolve/reject promise
     */
    private initDB(): Promise<IDBDatabase> {
        return new Promise( (resolve, reject) => {

            // Open database conn
            const req = indexedDB.open(this.dbName, this.version);

            // Provde database in promise if successful
            req.onsuccess = () => {
                this.handleSuccess(req, resolve);
            };

            // Otherwise error
            req.onerror = () => {
                this.handleError(req, reject);
            };

            // Create or upgrade schema
            req.onupgradeneeded = ( ) => {
                this.handleCreationUpgrade(req);
            };
        });
    }


    /**
     * Handles creating or upgrading the schema
     * 
     * @param req {@link IDBOpenDBRequest}
     */
    private handleCreationUpgrade(
        req: IDBOpenDBRequest
    ): void {
        const db = req.result;
        for ( const store of Object.values(this.STORES) ) {
            if ( !db.objectStoreNames.contains(store) ) {
                db.createObjectStore(
                    store,
                    {
                        autoIncrement: true,
                        keyPath: "id"
                    }
                );
            }
        }
    }


    /**
     * Handles successful openning of the database connection
     * 
     * @param req - {@link IDBOpenDBRequest}
     * @param resolve - {@link IDBOpenDBRequest} callback
     */
    private handleSuccess(
        req: IDBOpenDBRequest,
        resolve: (db: IDBDatabase) => void
    ): void {
        resolve(req.result);
    }


    /**
     * Handles failed openning of the database connection
     * 
     * @param req - {@link IDBOpenDBRequest}
     * @param resolve - {@link IDBOpenDBRequest} callback
     */
    private handleError(
        req: IDBOpenDBRequest,
        reject: ( reason ?: unknown ) => void
    ): void {
        reject(req.error);
    }


    /**
     * Performs required action under transaction
     * 
     * @param db - database
     * @param target - which store to put record in
     * @param record - record to insert
     * @param action - {@link StoreAction}
     * 
     * @returns {DbTransaction}
     */
    private transactionOperation(
        db: IDBDatabase,
        target: Stores,
        record: DbRecord,
        action: StoreAction
    ): DbTransaction {

        // Initialize variables
        let
            transaction: IDBTransaction,
            store: IDBObjectStore,
            resp: IDBRequest
        ;

        // Handle action
        switch (action) {

            // Adding record
            case StoreAction.PUT: {
                transaction = db.transaction(
                    target,
                    "readwrite"
                );
                store = transaction.objectStore(target)
                resp = store.put(record);
                break;
            }
            
            // Dropping record
            case StoreAction.GET: {
                transaction = db.transaction(
                    target,
                    "readonly"
                );
                store = transaction.objectStore(target)
                resp = store.get(record.id ?? -1);
                break;
            }

            // Unsupported action
            default: {
                throw new Error(`Unsupported store action:\t'${action}'`);
            }
        };

        // Return respon to caller for eval
        return {
            transaction: transaction, 
            resp: resp
        };
    }


    /**
     * Adds {@link Book} under transaction
     * 
     * @param book - book
     * 
     * @returns {Promise} on inserted primary key
     */
    public async addBook(book: Book): Promise<number> {
        const db = await this.dbPromise;
        return new Promise((resolve, reject) => {
            
            // Perform write operation under transation
            const dbTransOp: DbTransaction = this.transactionOperation(
                db,
                Stores.Books, 
                book,
                StoreAction.PUT
            );

            // Provide result
            let key: number;
            dbTransOp.resp.onsuccess = () => {
                key = dbTransOp.resp.result as number;
            };

            // Transaction committed
            dbTransOp.transaction.oncomplete = () => {
                resolve(key);
            };

            // Otherwise error
            dbTransOp.transaction.onabort = () => {
                reject(
                    dbTransOp.transaction.error ??
                    new Error("Transaction for book write aborted")
                );
            };
        });
    }


    /**
     * Fetch {@link Book} matching Id
     * 
     * @param id - primary key of the book
     * 
     * @returns {Promise} on {@link Book}
     */
    public async getBook(id: number): Promise< Book | undefined > {
        const db = await this.dbPromise;
        return new Promise( (resolve, reject) => {
            
            // Perform read action under transation
            const query: DbRecord = { id: id };
            const dbTransOp: DbTransaction = this.transactionOperation(
                db,
                Stores.Books,
                query,
                StoreAction.GET
            );

            // Provide result
            let book: Book | undefined;
            dbTransOp.resp.onsuccess = () => {
                dbTransOp.resp.result as Book | undefined;
            };
            dbTransOp.transaction.oncomplete = () => {
                resolve(book);
            }

            // Otherwise error
            dbTransOp.resp.onerror = () => {
                reject(dbTransOp.resp.error);
            }
            dbTransOp.transaction.onabort = () => {
                reject(
                    dbTransOp.transaction.error ??
                    new Error("Transaction for fetching book aborted")
                );
            }
        });
    }


    /**
     * Adds {@link Author} under transaction
     * 
     * @param author - author
     * 
     * @returns {Promise} on inserted primary key
     */
    public async addAuthor(author: Author): Promise<number> {
        const db = await this.dbPromise;
        return new Promise( (resolve, reject) => {
            
            // Perform write operation under transation
            const dbTransOp: DbTransaction = this.transactionOperation(
                db,
                Stores.Authors, 
                author,
                StoreAction.PUT
            );

            // Provide result
            let key: number;
            dbTransOp.resp.onsuccess = () => {
                key = dbTransOp.resp.result as number;
            };

            // Transaction committed
            dbTransOp.transaction.oncomplete = () => {
                resolve(key);
            };

            // Otherwise error
            dbTransOp.transaction.onabort = () => {
                reject(
                    dbTransOp.transaction.error ??
                    new Error("Transaction for author write aborted")
                );
            };
        });
    }


    /**
     * Get author by primary key
     * 
     * @param id - primary key
     * 
     * @returns {Promise} on {@link Author} matching key
     */
    public async getAuthor(id: number): Promise< Author | undefined > {
        const db = await this.dbPromise;
        return new Promise( (resolve, reject) => {
            
            // Perform read action under transaction
            const query: DbRecord = { id: id };
            const dbTransOp: DbTransaction  = this.transactionOperation(
                db,
                Stores.Authors,
                query,
                StoreAction.GET
            );

            // Provide result
            let author: Author | undefined;
            dbTransOp.resp.onsuccess = () => {
                author = dbTransOp.resp.result as Author | undefined;
            }
            dbTransOp.transaction.oncomplete = () => {
                resolve(author);
            };

            // Otherwise error
            dbTransOp.resp.onerror = () => {
                reject(dbTransOp.resp.error);
            }
            dbTransOp.transaction.onabort = () => {
                reject(
                    dbTransOp.transaction.error ??
                    new Error("Transaction for fetching author aborted")
                );
            }
        });
    }
}