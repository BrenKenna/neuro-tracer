/**
 * Defines positional enum for content placement
 *  on UI
 */
export const Zone = {
    TOP: 0,
    EDITOR: 1,
    BOTTOM: 2,
    LEFT: 3,
    RIGHT: 4
} as const;

export type Zone = typeof Zone[keyof typeof Zone];


/**
 * Defines a data model for annotations
 */
export interface Annotation {
    label: string;
    anno: Map<string, string>;
}


/**
 * Defines a data model for metadata
 */
export interface MetaData {
    title: string;
    description: string;
}



/**
 * Defines the data model for editor zone
 */
export interface Content {
    label: string;
    metaData: MetaData;
    description: string;
    pos: Zone;
    contentType: string;
    fontSize: number;
    fontType: string;
    data: string[];
    height: number;
    width: number;
    annotation: Annotation;
}


/**
 * Defines border data model
 */
export interface Border {
    label: string;
    metaData: MetaData;
    pos: Zone;
    contentType: string;
    fontSize: number;
    fontType: string;
    data: string[];
    height: number;
    width: number;
    annotation: Annotation;
}


/**
 * Defines a page as a collection of content
 *  with defined borders.
 */
export interface Page {
    label: string;
    metaData: MetaData;
    borders: Border[];
    data: Content[];
    annotation: Annotation;
}


/**
 * Defines a document as a collection of pages
 */
export interface Document {
    label: string;
    metaData: MetaData;
    data: Page[];
    annotation: Annotation;
}


/**
 * Defines a catalogue as a collection of 
 *  of documents
 */
export interface Catalogue {
    label: string;
    data: Map<string, Document>;
    annotation: Annotation;
}


/**
 * Defines a catalogue view as a collection of metadata
 */
export interface CatalogueView {
    label: string;
    data: MetaData[];
    annotation: Annotation;
}