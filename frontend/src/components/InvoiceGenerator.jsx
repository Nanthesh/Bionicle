import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@mui/material';

const InvoiceGenerator = ({ order }) => {
    const generateInvoice = () => {
        const doc = new jsPDF();
        const { _id, order_date, total_price, shipping_address, products } = order;

        const taxRate = 0.13;
        const subtotal = total_price / (1 + taxRate);
        const taxAmount = total_price - subtotal;

        // Header
        doc.setFontSize(18);
        doc.text(`Invoice / Facture`, 10, 10);
        doc.setFontSize(12);
        doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 10, 20);
        doc.text(`Order Date: ${new Date(order_date).toLocaleDateString()}`, 10, 30);
        doc.text(`Order #: ${_id}`, 10, 40);
        doc.text(`Sold By: The Bionicle`, 10, 50);

        // Billing and Shipping Addresses
        doc.text(`Billing Address:`, 10, 60);
        doc.text(`${shipping_address.address}`, 10, 65);
        doc.text(`${shipping_address.city}, ${shipping_address.state}, ${shipping_address.zipCode}`, 10, 70);
        doc.text(`${shipping_address.country}`, 10, 75);

        doc.text(`Shipping Address:`, 110, 60);
        doc.text(`${shipping_address.address}`, 110, 65);
        doc.text(`${shipping_address.city}, ${shipping_address.state}, ${shipping_address.zipCode}`, 110, 70);
        doc.text(`${shipping_address.country}`, 110, 75);

        // Order Details Table
        const tableColumn = ["Description", "Quantity", "Unit Price", "Total"];
        const tableRows = [];

        products.forEach((item) => {
            const productTitle = item.product_id.title;
            const quantity = item.quantity;
            const unitPrice = `$${item.product_id.price.toFixed(2)}`;
            const total = `$${(item.quantity * item.product_id.price).toFixed(2)}`;
            tableRows.push([productTitle, quantity, unitPrice, total]);
        });

        doc.autoTable({
            startY: 85,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [0, 0, 0], textColor: 255 },
            styles: { fontSize: 10, cellPadding: 4 },
            columnStyles: {
                0: { cellWidth: 80 },
                1: { cellWidth: 20, halign: 'center' },
                2: { cellWidth: 30, halign: 'right' },
                3: { cellWidth: 30, halign: 'right' },
            },
        });

        // Summary Section
        const finalY = doc.previousAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, finalY);
        doc.text(`Tax (13%): $${taxAmount.toFixed(2)}`, 140, finalY + 5);
        doc.text(`Shipping Charges: $0.00`, 140, finalY + 10);
        doc.text(`Total Payable: $${total_price.toFixed(2)}`, 140, finalY + 20);

        // Footer
        doc.setFontSize(10);
        doc.text(`For questions about your order, contact us at support@example.com`, 10, finalY + 30);

        // Save the PDF
        doc.save(`Invoice_${_id}.pdf`);
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={generateInvoice}
            sx={{
                fontSize: { xs: '0.4rem', sm: '0.55rem', md: '0.75rem' }, // Adjusts font size based on screen size
                padding: { xs: '4px 8px', sm: '4px 12px', md: '4px 16px' }, // Adjusts padding
                borderRadius: '20px',
                backgroundColor: 'black',
                textTransform: 'none',
                ':hover': {
                    backgroundColor: '#5a52cc',
                },
                display: 'inline-block',
                minWidth: { xs: 'auto', sm: 'fit-content' }, // Adjusts minimum width
                height: { xs: '28px', sm: '32px' }, // Adjusts height
            }}
        >
            Download Invoice
        </Button>
    );
};

export default InvoiceGenerator;
