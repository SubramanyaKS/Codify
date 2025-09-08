import React from 'react';

const JsIntroduction = () => {

    const jsUsedFor = [
        {
            title: "Frontend Development",
            description: "Creating interactive user interfaces with frameworks like React, Angular, and Vue.js"
        },
        {
            title: "Backend Development",
            description: "Building server-side applications using Node.js, Express, and other runtime environments"
        },
        {
            title: "Mobile Development",
            description: "Creating cross-platform mobile apps with React Native, Ionic, and other frameworks"
        },
        {
            title: "Desktop Applications",
            description: "Building cross-platform desktop apps with Electron and other tools"
        }
    ]


    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Introduction to JavaScript</h1>

            <div className="prose max-w-none">
                <p className="text-base text-gray-700 mb-6 leading-relaxed">
                    Welcome to the JavaScript fundamentals course on Codify! This tutorial is designed to be your comprehensive guide to learning JavaScript, from the basics to advanced concepts. Whether you're just starting your programming journey or looking to refresh your skills, this resource will serve as a valuable reference throughout your learning process.
                </p>

                <div className="mb-4 bg-white p-4 rounded-md shadow-sm border border-gray-200 hover:border-primary-300 transition-colors">
                    <p className="text-primary-800">
                        <strong className="font-semibold">Did you know?</strong> JavaScript is one of the core technologies of the World Wide Web, alongside HTML and CSS. Over 97% of websites use JavaScript on the client side for web page behavior.
                    </p>
                </div>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Learn JavaScript?</h2>
                    <p className="text-gray-700 mb-4">
                        JavaScript brings websites to life by adding interactivity and dynamic behavior. Think of a website as a house:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                        <li><strong className="font-semibold text-gray-800">HTML</strong> is like the structure - walls, floors, and roof</li>
                        <li><strong className="font-semibold text-gray-800">CSS</strong> is the paint and decoration - making it look beautiful</li>
                        <li><strong className="font-semibold text-gray-800">JavaScript</strong> is the electricity - making everything work and respond to user actions</li>
                    </ul>
                    <p className="text-gray-700">
                        Without JavaScript, websites would be static and non-interactive. JavaScript enables features like form validation, animations, real-time updates, and much more.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">JavaScript in Modern Development</h2>
                    <p className="text-gray-700 mb-4">
                        JavaScript has evolved far beyond its original role in web browsers. Today, it's used for:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        {jsUsedFor.map((item, index) => {
                            return (
                                <div key={index} className='bg-white p-4 rounded-md shadow-sm border border-gray-200 hover:border-primary-300 transition-colors'>
                                    <h3 className="text-lg font-semibold text-primary-600 mb-2">{item.title}</h3>
                                    <p className="text-gray-700 text-sm">{item.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Understanding ECMAScript</h2>
                    <p className="text-gray-700 mb-4">
                        JavaScript is based on the ECMAScript standard, which ensures consistency across different implementations. Here's a brief timeline of its evolution:
                    </p>
                    <div className="overflow-x-auto mb-6">
                        <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Version</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Year</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Key Features</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-700">ES5</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">2009</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">Strict mode, JSON support, array methods</td>
                                </tr>
                                <tr className="bg-gray-50 hover:bg-gray-100">
                                    <td className="px-4 py-3 text-sm text-gray-700">ES6/ES2015</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">2015</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">Let/const, arrow functions, classes, modules</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-700">ES2016-2022</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">2016-2022</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">Async/await, optional chaining, nullish coalescing, top-level await</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="bg-white p-4 rounded-md shadow-sm border border-gray-200 hover:border-primary-300 transition-colors">
                    <h3 className="text-lg font-semibold text-primary-800 mb-2">Getting Started</h3>
                    <p className="text-primary-700">
                        Ready to dive in? In the next sections, we'll explore JavaScript fundamentals, including variables, data types, functions, and more. Each concept will be explained with clear examples and practical exercises to reinforce your learning.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default JsIntroduction;
