import AddProjectForm from '../components/projects/AddProjectForm'
import Footer from '../components/layout/Footer'

export default function AddProjectPage() {
    return (
        <div className="min-h-screen bg-[#0B0B0B] flex flex-col">
            <div className="flex-1 p-6">
                <div className="max-w-[1200px] mx-auto">
                    <AddProjectForm />
                </div>
            </div>
            <Footer />
        </div>
    )
}
