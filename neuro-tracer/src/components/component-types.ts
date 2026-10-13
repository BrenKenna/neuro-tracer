/**
 * Navigation bar data model
 * 
 * @param {string} label - The label of the navigation item
 * @param {string} path - The path of the navigation item
 */
export interface NavigationItem {
    label: string;
    path: string;
}


/**
 * Navigation bar items
 * 
 * @type {NavigationItem[]}
 * @export
 */
export const navigation: NavigationItem[] = [
    {
        label: "Home",
        path: "/"
    },

    {
        label: "About",
        path: "/about"
    },

    {
        label: "Account",
        path: "/account"
    },

    {
        label: "Catalogue",
        path: "/catalogue"
    }
];