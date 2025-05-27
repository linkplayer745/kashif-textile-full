export default function ReturnsExchangePage() {
  return (
    <section className="main-container main-padding">
      <h1 className="main-heading">Returns &amp; Exchange Policy</h1>
      <div className="text-dark-grey space-y-6">
        <p>
          Your satisfaction is our top priority. If for any reason you’re not
          completely happy with your purchase, you may return or exchange
          eligible items within <strong>30 days</strong> of delivery.
        </p>
        <h2 className="text-2xl font-semibold">Eligibility</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            Items must be unworn, unwashed, and in original condition with tags
            attached.
          </li>
          <li>
            Sale or clearance items are <em>final sale</em> and not eligible for
            return.
          </li>
          <li>Custom or personalized items cannot be returned or exchanged.</li>
        </ul>
        <h2 className="text-2xl font-semibold">
          How to Initiate a Return/Exchange
        </h2>
        <ol className="list-inside list-decimal space-y-2">
          <li>
            Email our support team at{" "}
            <a
              href="mailto:returns@kashiftextile.com"
              className="text-blue-600 hover:underline"
            >
              returns@kashiftextile.com
            </a>{" "}
            with your order number and reason for return.
          </li>
          <li>We will send you a pre-paid shipping label and instructions.</li>
          <li>
            Pack the item securely in its original packaging and affix the
            label.
          </li>
          <li>
            Drop it off at the designated carrier. We’ll notify you once we
            receive it.
          </li>
        </ol>
        <h2 className="text-2xl font-semibold">Refunds & Exchanges</h2>
        <p>
          <strong>Refunds:</strong> Processed within 5–7 business days after we
          receive the return. Original payment method will be credited.
          <strong>Exchanges:</strong> If your requested size or color is in
          stock, we’ll send the replacement at no extra cost.
        </p>
        <h2 className="text-2xl font-semibold">Shipping Costs</h2>
        <p>
          We cover return shipping on defective or incorrect items. For all
          other returns, a flat fee of Rs. 200 will be deducted from your
          refund.
        </p>
        <p>
          If you have any questions about our Returns &amp; Exchange Policy,
          please contact us at{" "}
          <a
            href="mailto:returns@kashiftextile.com"
            className="text-blue-600 hover:underline"
          >
            returns@kashiftextile.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}
