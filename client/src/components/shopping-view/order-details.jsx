import { useSelector } from "react-redux";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Button, Input } from "../ui/button"; // Assuming Input is part of your UI library
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import emailjs from "emailjs-com"; // Import EmailJS
import { jsPDF } from "jspdf"; // Import jsPDF
import html2canvas from "html2canvas"; // Import html2canvas

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);
  const billRef = useRef();
  const [loading, setLoading] = useState(false); // State for loading
  const [emailDialogOpen, setEmailDialogOpen] = useState(false); // State to control email input dialog
  const [emailInput, setEmailInput] = useState(''); // State to store user's email input

  // Function to generate the PDF and send email
  const handleEmailBill = async () => {
    if (!emailInput) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true); // Set loading to true when starting the process

      // Capture the content of the bill
      const canvas = await html2canvas(billRef.current);
      const imgData = canvas.toDataURL("image/png");
      
      // Create a new PDF document
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      
      // Generate PDF blob
      const pdfBlob = pdf.output("blob");
      const formData = new FormData();
      formData.append("file", pdfBlob, "invoice.pdf"); // Append the PDF blob

      // Upload the PDF to the backend
      const response = await axios.post("http://localhost:5000/api/upload-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const pdfLink = response.data.pdfLink; // Assuming your backend returns the PDF link

      if (pdfLink) {
        // Use EmailJS to send the email
        const templateParams = {
          email: emailInput, // Use the provided email
          from_name: user.userName,
          message: `Here is the link to your bill: ${pdfLink}`,
        };

        emailjs
          .send("service_rcgzse7", "template_kre3rv6", templateParams, "2TSbVfjZE9-turjBO")
          .then(() => {
            toast.success("Bill link has been sent to your email!"); // Success toast
            setEmailDialogOpen(false); // Close the email input dialog after successful email send
          })
          .catch((error) => {
            console.error("EmailJS Error:", error); // Log the error for debugging
            toast.error("Error sending email: " + error.text); // Error toast
          });
      } else {
        toast.error("Error generating PDF: No PDF link returned."); // Error toast
      }
    } catch (error) {
      console.error("PDF Generation Error:", error); // Log the error for debugging
      toast.error("Error generating PDF: " + error.message); // Error toast
    } finally {
      setLoading(false); // Set loading to false after the process is complete
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="font-medium text-center text-lg">CustomTees</div>
        <Separator />
        <div ref={billRef} className="grid gap-6">
          {/* Order Info */}
          <div className="grid gap-2">
            <div className="flex mt-6 items-center justify-between">
              <p className="font-medium">Order ID</p>
              <Label>{orderDetails?._id}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Date</p>
              <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Price</p>
              <Label>${orderDetails?.totalAmount}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Payment Method</p>
              <Label>{orderDetails?.paymentMethod}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Payment Status</p>
              <Label>{orderDetails?.paymentStatus}</Label>
            </div>
          </div>

          <Separator />

          {/* Cart Items */}
          <div className="grid gap-4">
            <div className="font-medium">Cart Items</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{item.title}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>Price: ${item.price}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Shipping Info */}
          <div className="grid gap-4">
            <div className="font-medium">Shipping Info</div>
            <div>
              <span>{user.userName}</span>
              <div>{orderDetails?.addressInfo?.address}</div>
              <div>{orderDetails?.addressInfo?.city}</div>
              <div>{orderDetails?.addressInfo?.pincode}</div>
              <div>{orderDetails?.addressInfo?.phone}</div>
              <div>{orderDetails?.addressInfo?.notes}</div>
            </div>
          </div>
        </div>

        {/* Download and Email Buttons */}
        <div className="flex justify-between">
          <Button onClick={() => {/* Functionality for Save as PDF can be added here if needed */}}>Save as PDF</Button>
          <Button onClick={() => setEmailDialogOpen(true)} disabled={loading}>
            {loading ? "Sending..." : "Email Me"}
          </Button>
        </div>

        {/* Email Input Dialog */}
        {emailDialogOpen && (
          <div className="email-input-dialog">
            <div className="dialog-header">
              <h2>Enter Your Email Address</h2>
            </div>
            <div className="dialog-body">
              <Input
                type="email"
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </div>
            <div className="dialog-footer">
              <Button onClick={handleEmailBill} disabled={loading}>
                {loading ? "Sending..." : "Send Bill"}
              </Button>
              <Button onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
