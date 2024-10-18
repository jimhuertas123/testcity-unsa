export enum ValidFunctions{
    //Users (only admin users)
    editUser       = 'editUser',
    createUser   = 'createUser',
    deleteuser      = 'deleteuser',

    //General data (organizer users)
    viewDashboard = 'viewDashboard',
    
    //Routes  
    viewRoute = 'viewRoute', //only driver
    generateRoute = 'generateRoutes', //organizer, admin
}