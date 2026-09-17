import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import type { Course } from '../types';
import client from '../api/client';
import { COURSES_CATALOG, COURSE_CATEGORIES } from '../data/courseCatalog';

const mapCatalogToCourses = (items: typeof COURSES_CATALOG): Course[] => {
  return items.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    instructorId: 'inst-skillforge',
    instructorName: 'SkillForge Senior Staff Instructor',
    category: c.category || 'Development',
    difficulty: c.difficulty || 'Intermediate',
    duration: c.duration || '6 hours',
    isCertificationPrep: Boolean(c.isCertificationPrep),
    targetCertification: c.targetCertification,
    certDisclaimer: c.certDisclaimer || 'Official SkillForge Course Completion Certificate awarded upon passing all lectures & quizzes.',
    skills: c.skills || [c.category, 'Software Engineering'],
    modulesCount: c.modulesCount || 4,
    thumbnail: c.category === 'Cloud'
      ? 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80'
      : c.category === 'AI/ML'
      ? 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80'
      : c.category === 'DevOps'
      ? 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80'
      : c.category === 'DSA'
      ? 'https://images.unsplash.com/photo-1516116211227-bbc13c4155b4?w=800&q=80'
      : c.category === 'Core CS'
      ? 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80'
      : c.category === 'Placement'
      ? 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80'
      : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    thumbnailUrl: undefined,
    enrolledCount: 2840 + c.title.length * 23,
    lectureCount: c.lectures?.length || 5,
    price: 0,
    rating: 4.9
  }));
};

const INITIAL_COURSES = mapCatalogToCourses(COURSES_CATALOG);

const CatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [categories, setCategories] = useState<string[]>(COURSE_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    // Load categories
    client.get('/courses/categories')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCategories(res.data);
        }
      })
      .catch(() => {});

    // Load courses from backend if available, merge with catalog
    client.get('/courses')
      .then(res => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: Course[] = res.data.map((c: any) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            instructorId: c.instructorId,
            instructorName: c.instructorName || c.instructor?.name || 'SkillForge Faculty',
            category: c.category || 'Development',
            difficulty: c.difficulty || 'Intermediate',
            duration: c.duration || '6 hours',
            isCertificationPrep: Boolean(c.isCertificationPrep),
            targetCertification: c.targetCertification,
            certDisclaimer: c.certDisclaimer,
            skills: c.skills || [c.category, 'Software Engineering'],
            modulesCount: c.modulesCount || 4,
            thumbnail: c.thumbnailUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
            thumbnailUrl: c.thumbnailUrl,
            enrolledCount: c.enrolledCount || 1250,
            lectureCount: c.lectures?.length || 8,
            price: 0,
            rating: c.rating || 4.9
          }));

          const existingIds = new Set(mapped.map((m) => m.id));
          const merged: Course[] = [...mapped];
          INITIAL_COURSES.forEach(c => {
            if (!existingIds.has(c.id)) {
              merged.push(c);
            }
          });
          setCourses(merged);
        }
      })
      .catch(err => console.warn('Using client catalog for courses:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (course.skills && course.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())));
    
    let matchesCategory = true;
    if (activeCategory === 'All') {
      matchesCategory = true;
    } else if (activeCategory === 'Certification Prep') {
      matchesCategory = Boolean(course.isCertificationPrep);
    } else {
      matchesCategory = course.category.toLowerCase() === activeCategory.toLowerCase();
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Hero Section */}
      <div className="bg-slate-900 border-b border-slate-800 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-900"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Expand Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Skills</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Discover thousands of courses taught by industry experts. Advance your career today.
          </p>
          
          <div className="max-w-2xl mx-auto relative flex items-center">
            <Search className="absolute left-4 text-slate-500 h-5 w-5" />
            <input
              type="text"
              placeholder="What do you want to learn?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg text-lg"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full hide-scrollbar">
            <Filter className="h-5 w-5 text-slate-400 flex-shrink-0 mr-2" />
            {categories.map(category => {
              const count = category === 'All'
                ? courses.length
                : category === 'Certification Prep'
                ? courses.filter(c => c.isCertificationPrep).length
                : courses.filter(c => c.category.toLowerCase() === category.toLowerCase()).length;

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeCategory === category
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{category}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeCategory === category ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span>Loading courses catalog...</span>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
              <Search className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-medium text-slate-200 mb-2">No courses found</h3>
            <p className="text-slate-400">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
