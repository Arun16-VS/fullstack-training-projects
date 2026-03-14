using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CollegeMVCApp.Data;
using CollegeMVCApp.Models;

namespace CollegeMVCApp.Controllers
{
    public class CourseStreamsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CourseStreamsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: CourseStreams
        public async Task<IActionResult> Index()
        {
            return View(await _context.CourseStreams.ToListAsync());
        }

        // GET: CourseStreams/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var courseStream = await _context.CourseStreams
                .FirstOrDefaultAsync(m => m.Id == id);
            if (courseStream == null)
            {
                return NotFound();
            }

            return View(courseStream);
        }

        // GET: CourseStreams/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: CourseStreams/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Name,Description")] CourseStream courseStream)
        {
            if (ModelState.IsValid)
            {
                _context.Add(courseStream);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(courseStream);
        }

        // GET: CourseStreams/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var courseStream = await _context.CourseStreams.FindAsync(id);
            if (courseStream == null)
            {
                return NotFound();
            }
            return View(courseStream);
        }

        // POST: CourseStreams/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Description")] CourseStream courseStream)
        {
            if (id != courseStream.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(courseStream);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CourseStreamExists(courseStream.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(courseStream);
        }

        // GET: CourseStreams/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var courseStream = await _context.CourseStreams
                .FirstOrDefaultAsync(m => m.Id == id);
            if (courseStream == null)
            {
                return NotFound();
            }

            return View(courseStream);
        }

        // POST: CourseStreams/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var courseStream = await _context.CourseStreams.FindAsync(id);
            if (courseStream != null)
            {
                _context.CourseStreams.Remove(courseStream);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CourseStreamExists(int id)
        {
            return _context.CourseStreams.Any(e => e.Id == id);
        }
    }
}
