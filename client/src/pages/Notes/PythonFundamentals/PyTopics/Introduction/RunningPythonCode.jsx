import React from 'react';
import CodeBlock from '../../../components/CodeBlock';

const RunningPythonCode = () => {
    const executionMethods = [
        {
            method: "Interactive Mode (Python Shell)",
            description: "Type 'python' or 'python3' in terminal to start interactive mode",
            pros: "Great for testing small code snippets",
            example: "python\n>>> print('Hello, World!')\nHello, World!"
        },
        {
            method: "Script Mode",
            description: "Write code in .py files and run them",
            pros: "Best for larger programs and projects",
            example: "python my_script.py"
        },
        {
            method: "IDE/Text Editor",
            description: "Use integrated development environments",
            pros: "Full-featured development with debugging",
            example: "VS Code, PyCharm, IDLE"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                Running <span className='text-primary-600 dark:text-primary-400'>Python Code</span>
            </h1>

            <div className="prose max-w-none">
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    Now that you have Python installed, let&apos;s explore different ways to run Python code. 
                    There are several methods, each suitable for different purposes.
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">1. Interactive Mode (Python Shell)</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        The Python shell allows you to execute Python commands one at a time. It&apos;s perfect for testing small pieces of code:
                    </p>
                    <CodeBlock code={`# Open terminal and type:
python
# or
python3

# You'll see something like:
Python 3.12.0 (main, Oct  2 2023, 16:20:00)
[GCC 13.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>

# Now you can type Python commands:
>>> print("Hello, Python!")
Hello, Python!
>>> 2 + 3
5
>>> name = "Alice"
>>> print(f"Hello, {name}!")
Hello, Alice!`} />
                    <p className="text-gray-700 dark:text-gray-300 mt-4">
                        To exit the Python shell, type <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">exit()</code> or press Ctrl+D (Linux/Mac) or Ctrl+Z then Enter (Windows).
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">2. Script Mode</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        For larger programs, you&apos;ll write your code in files with <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.py</code> extension:
                    </p>
                    <div className="bg-white dark:bg-black p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Step 1: Create a Python file</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Create a file called <code>hello.py</code> with the following content:</p>
                        <CodeBlock code={`# hello.py
print("Hello, World!")
print("Welcome to Python programming!")

name = input("What's your name? ")
print(f"Nice to meet you, {name}!")`} />
                    </div>
                    <div className="bg-white dark:bg-black p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Step 2: Run the file</h4>
                        <CodeBlock code={`# Navigate to the file directory and run:
python hello.py
# or
python3 hello.py`} />
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">3. Using IDEs and Text Editors</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* VS Code */}
                        <div className="bg-white dark:bg-black p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-primary-600 mb-3">🔵 Visual Studio Code</h3>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li>• Install Python extension</li>
                                <li>• Create .py file</li>
                                <li>• Press F5 to run or Ctrl+F5</li>
                                <li>• Use integrated terminal</li>
                            </ul>
                        </div>
                        
                        {/* PyCharm */}
                        <div className="bg-white dark:bg-black p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-primary-600 mb-3">🟢 PyCharm</h3>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li>• Professional Python IDE</li>
                                <li>• Built-in debugger</li>
                                <li>• Right-click → Run</li>
                                <li>• Advanced code completion</li>
                            </ul>
                        </div>

                        {/* IDLE */}
                        <div className="bg-white dark:bg-black p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-primary-600 mb-3">🐍 IDLE</h3>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li>• Comes with Python installation</li>
                                <li>• Simple and lightweight</li>
                                <li>• File → New → Create script</li>
                                <li>• F5 to run</li>
                            </ul>
                        </div>

                        {/* Jupyter Notebook */}
                        <div className="bg-white dark:bg-black p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-primary-600 mb-3">📊 Jupyter Notebook</h3>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li>• Great for data science</li>
                                <li>• Interactive notebooks</li>
                                <li>• Install: pip install jupyter</li>
                                <li>• Run: jupyter notebook</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Online Python Interpreters</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        If you can&apos;t install Python locally, try these online options:
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-black p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                            <h4 className="font-semibold text-primary-600 mb-2">Repl.it</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Full Python environment in browser</p>
                        </div>
                        <div className="bg-white dark:bg-black p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                            <h4 className="font-semibold text-primary-600 mb-2">Python.org Shell</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Simple online Python shell</p>
                        </div>
                        <div className="bg-white dark:bg-black p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                            <h4 className="font-semibold text-primary-600 mb-2">Google Colab</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Jupyter notebooks with GPU access</p>
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Your First Python Program</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Let&apos;s create a simple program that demonstrates basic Python concepts:
                    </p>
                    <CodeBlock code={`# my_first_program.py
# This is a comment - it's ignored by Python

# Print a welcome message
print("Welcome to Python Programming!")
print("=" * 30)  # Print 30 equal signs

# Get user input
name = input("Enter your name: ")
age = input("Enter your age: ")

# Process and display information
print(f"Hello, {name}!")
print(f"You are {age} years old.")

# Simple calculation
birth_year = 2024 - int(age)
print(f"You were born around {birth_year}")

# Fun fact
if int(age) >= 18:
    print("You are an adult!")
else:
    print("You are a minor!")

print("Thanks for trying Python!")`} />
                </section>

                <div className={`bg-green-50 dark:bg-green-900/20 p-4 rounded-md border border-green-200 dark:border-green-700`}>
                    <p className="text-green-700 dark:text-green-300">
                        <strong className="font-semibold">🎯 Practice Time:</strong> Try running the program above using different methods. 
                        Experiment with the interactive shell for quick tests and use script mode for complete programs.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RunningPythonCode;