
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">Create Your Account</h1>
          <AuthForm defaultTab="register" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
