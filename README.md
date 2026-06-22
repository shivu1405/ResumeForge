# Resume Forge

Resume Forge is a modern AI-powered ATS Resume Analyzer designed to help students, job seekers, and professionals evaluate and improve their resumes. The platform provides ATS scoring, job description matching, interview preparation, skill analysis, and career guidance through a premium dashboard experience.

Built as a standalone React application, Resume Forge performs resume analysis entirely on the client side, eliminating the need for external servers while delivering fast and responsive feedback.

## Features

### ATS Resume Analysis

* Upload PDF resumes and extract content in real time
* Generate ATS compatibility scores
* Analyze resume structure and formatting
* Identify strengths and improvement areas
* Provide recruiter-style feedback

### Job Description Matching

* Compare resumes against target job descriptions
* Calculate skill match scores
* Identify missing keywords and technologies
* Generate personalized recommendations for improvement

### Interview Preparation

* Technical interview questions
* Behavioral interview questions
* Project-based discussion prompts
* HR interview preparation guidance
* STAR method recommendations

### Skill Intelligence

* Automatic skill extraction from resumes
* Categorized technology and tool recognition
* Gap analysis against target roles
* Career-specific recommendations

### Career Roadmaps

* Frontend Developer
* Full Stack Developer
* DevOps Engineer
* Data Scientist
* UI/UX Designer

### Resume Management

* Resume history tracking
* Version management
* Local persistence using browser storage
* Report export and print support

## Technology Stack

### Frontend

* React
* TypeScript
* Vite

### Styling

* Vanilla CSS
* Glassmorphism UI
* Responsive Design
* Custom Design System

### Libraries

* pdfjs-dist
* lucide-react

### State Management

* React Context API
* Local Storage Persistence

## How It Works

1. Upload a PDF resume.
2. Resume Forge extracts and processes the resume content.
3. The analysis engine evaluates formatting, structure, keywords, and skills.
4. An ATS score and detailed report are generated.
5. Users can compare their resume against job descriptions and receive tailored recommendations.
6. Interview preparation questions and career roadmaps are generated based on the analyzed profile.

## Architecture

The application follows a client-side architecture consisting of:

* PDF Processing Layer
* Resume Analysis Engine
* Job Matching Engine
* Interview Preparation Generator
* State Management Layer
* Dashboard and Visualization Layer

All processing is performed locally in the browser, ensuring privacy and fast response times.

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/resume-forge.git
cd resume-forge
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Screenshots

### Landing Page
<img width="1893" height="973" alt="image" src="https://github.com/user-attachments/assets/dbb3e524-94e4-46ac-9c9a-93b298580fdd" />


### ATS Analysis Dashboard

<img width="1912" height="987" alt="image" src="https://github.com/user-attachments/assets/bceda374-eef6-4315-9f11-a9639791f04a" />


### Job Matching

<img width="1902" height="981" alt="image" src="https://github.com/user-attachments/assets/0160e2ab-e80b-4193-8da7-dccce0fbee33" />


### Interview Preparation

<img width="1902" height="986" alt="image" src="https://github.com/user-attachments/assets/d9fced7a-0e34-4d69-88a7-8d35860a50b1" />


## Project Highlights

* Real-time PDF resume parsing
* Client-side ATS scoring engine
* Skill extraction and classification
* Job description similarity analysis
* Interactive dashboard experience
* Resume version tracking
* Fully responsive design
* No backend required

## Future Enhancements

* AI-powered resume rewriting
* Multi-resume comparison
* Resume templates and exports
* Industry-specific scoring models
* LinkedIn profile analysis
* Cover letter generation
* Cloud synchronization

## License

This project is intended for educational, portfolio, and demonstration purposes.

## Author

Developed by Shivasri

https://resumeforge-alpha.vercel.app/

