
// Data stores
export const Stores = {
    Books: "Books",
    Authors: "Authors" 
} as const;

export type Stores = (typeof Stores)[keyof typeof Stores];


/**
 * Book data model
 */
export interface Book {
    id?: number;
    title: string;
    author: number;
    genre: string;
}


/**
 * Author data model
 */
export interface Author {
    id?: number;
    firstName: string;
    lastName: string;
}


/**
 * Service class for interacting with sandbox database
 * 
 */
export class SandboxService {

    // Attributes
    private dbPromise: Promise<IDBDatabase>;
    private readonly STORES: typeof Stores;
    private readonly dbName: string;
    private version: number;


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
        this.dbPromise = this.initDB();
        this.STORES = Stores;
        this.version = version;
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
}