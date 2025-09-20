// const adminMiddleware = async (req,res,next)=>{
//     try {
//         const adminRole = req.user.isAdmin;
//         if(!adminRole){
//             return res.status(403).json({message:"Access denied. User is not an admin"});
//         }
//         next();
//     } catch (error) {
//         next(error);
//     }
// }
// export default adminMiddleware;
const adminMiddleware = async (req, res, next) => {
    try {
      // Check if user has any admin role
      const isAdmin = req.user.isAdmin;
      const isReadOnlyAdmin = req.user.isReadOnlyAdmin;
      
      if (!isAdmin && !isReadOnlyAdmin) {
        return res.status(403).json({ message: "Access denied. User is not an admin" });
      }
      
      // For read-only admins, block all mutation requests
      if (isReadOnlyAdmin && !isAdmin) {
        const method = req.method;
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          return res.status(403).json({ 
            message: "Access denied. Read-only admin cannot modify data" 
          });
        }
      }
      
      // Attach admin type information to the request for downstream use
      req.user.adminType = isAdmin ? 'full' : 'readonly';
      
      next();
    } catch (error) {
      next(error);
    }
  };
  
  export default adminMiddleware;