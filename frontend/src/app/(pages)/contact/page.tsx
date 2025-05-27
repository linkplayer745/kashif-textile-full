// app/contact/page.tsx
export default function ContactPage() {
  return (
    <section className="main-container main-padding">
      <h1 className="main-heading">Contact Us</h1>

      <div className="text-dark-grey space-y-6">
        <p>
          We’d love to hear from you! Whether you have questions about our
          products, need help with an order, or just want to say hello, our team
          is here to help.
        </p>

        <div className="grid grid-cols-1 place-items-center gap-8 md:grid-cols-2">
          {/* Contact Details */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Get in Touch</h2>
            <ul className="space-y-2">
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:support@kashiftextile.com"
                  className="text-blue-600 hover:underline"
                >
                  support@kashiftextile.com
                </a>
              </li>
              <li>
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:+92 300 1234968"
                  className="text-blue-600 hover:underline"
                >
                  +92 300 1234968
                </a>
              </li>
              <li>
                <strong>Address:</strong> 123 Textile Lane, Karachi, Pakistan
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Send Us a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="text-dark-grey mb-1 block text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className="focus:ring-focus w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-dark-grey mb-1 block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="focus:ring-focus w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-dark-grey mb-1 block text-sm font-medium">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="How can we help you?"
                  className="focus:ring-focus w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-red border-red rounded border px-6 py-2 font-medium text-white transition hover:bg-white hover:text-black"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
