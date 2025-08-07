import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import Logo from "@/components/common/Logo";
import Button from "@/components/common/Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import ThemeToggle from "@/components/common/ThemeToggle";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    accountNumber: "",
    ifscCode: "",
    country: "",
    role: "mentor",
    mentorType: "Instructor Associate",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { mentors, setMentors } = useUser();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignup) {
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        const isValid = String(formData.ifscCode).match("^[A-Z]{4}[0][A-Z0-9]{6}$");
        if(!isValid){
          throw new Error('Wrong Ifsc format');
        }
        await signup(
          formData.email,
          formData.password,
          fullName,
          formData.role,
          formData.mentorType,
          {
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifscCode,
            country: formData.country,
          }
        );
        toast.success("Account created successfully");
      } else {
        await login(formData.email, formData.password);
        toast.success("Logged in successfully");
      }

      navigate(formData.role === "admin" ? "/admin" : "/mentor");
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center">
          <div className="flex justify-center mt-6">
            <Logo />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            {isSignup ? "Join the Platform" : "Verify Your Identity"}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isSignup
              ? "Enter your details to create an account"
              : "Enter your credentials to access your account"}
          </p>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-6 shadow sm:rounded-lg sm:px-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {isSignup && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="accountNumber"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Account Number
                    </label>
                    <input
                      type="text"
                      id="accountNumber"
                      name="accountNumber"
                      required
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="ifscCode"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      id="ifscCode"
                      name="ifscCode"
                      required
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 pr-10 text-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {isSignup && (
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                >
                  <option value="mentor">Mentor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            )}

            {isSignup && formData.role === "mentor" && (
              <div>
                <label
                  htmlFor="mentorType"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Mentor Type
                </label>
                <select
                  id="mentorType"
                  name="mentorType"
                  value={formData.mentorType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="DSA Instructor">DSA Instructor</option>
                  <option value="Coding Instructor">Coding Instructor</option>
                  <option value="CSBT Instructor">CSBT Instructor</option>
                  <option value="Instructor Associate">
                    Instructor Associate
                  </option>
                </select>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              isFullWidth
              leftIcon={isSignup ? <UserPlus size={16} /> : <LogIn size={16} />}
            >
              {isSignup ? "Create Account" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  {isSignup ? "Already have an account?" : "Need an account?"}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {isSignup ? "Sign in instead" : "Create an account"}
              </button>
              <div className="absolute top-0 right-0 p-4 flex items-center gap-4 z-50">
                <ThemeToggle />
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
