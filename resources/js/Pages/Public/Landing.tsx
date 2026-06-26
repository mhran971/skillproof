import { Head, Link } from '@inertiajs/react';

export default function Landing() {
    return (
        <>
            <Head title="SkillProof - Prove Your Skills. Get Hired." />

            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
                {/* Navigation */}
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex items-center">
                                <span className="text-2xl font-bold text-indigo-600">SkillProof</span>
                            </div>
                            <div className="flex space-x-4">
                                <Link href={route('login')} className="text-gray-600 hover:text-gray-900 px-3 py-2">
                                    Login
                                </Link>
                                <Link href={route('register')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Prove Your Skills.<br />
                            <span className="text-indigo-600">Get Hired.</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Show companies what you can do through challenges, projects, videos,
                            and verified assessments. No resumes needed.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link href={route('register')} className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700">
                                Start Building Your Skill Passport
                            </Link>
                            <Link href={route('register')} className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-50">
                                Hire Skilled Talent
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="bg-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-6">
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Skills Over Resumes</h3>
                                <p className="text-gray-600">Prove your abilities through real-world challenges and projects.</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Verified Assessments</h3>
                                <p className="text-gray-600">AI-powered and human-reviewed evaluations you can trust.</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Global Opportunities</h3>
                                <p className="text-gray-600">Connect with companies worldwide based on your proven skills.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
