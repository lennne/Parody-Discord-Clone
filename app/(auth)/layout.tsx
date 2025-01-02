const AuthLayout = ({children}: {children:React.ReactNode}) => {
    return ( 
        <div className="h-full justify-center items-center flex">
            {children}
        </div>
     );
}
 
export default AuthLayout;