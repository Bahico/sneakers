#!/usr/bin/env node

/**
 * Script to enforce Tailwind CSS usage and disallow inline styles in HTML templates
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const INLINE_STYLE_PATTERNS = [
  /style\s*=\s*["']/g, // style="..." or style='...'
  /\[style\]/g, // [style]="..."
  /\[style\./g, // [style.property]="..."
];

const EXCLUDED_DIRS = ['node_modules', 'dist', '.angular'];
const HTML_EXT = '.html';

let hasErrors = false;
const errors = [];

/**
 * Check if a directory should be excluded
 */
function shouldExcludeDir(dirPath) {
  return EXCLUDED_DIRS.some(excluded => dirPath.includes(excluded));
}

/**
 * Check a single HTML file for inline styles
 */
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  INLINE_STYLE_PATTERNS.forEach((pattern, patternIndex) => {
    const matches = content.matchAll(pattern);
    
    for (const match of matches) {
      const matchIndex = match.index;
      const lineNumber = content.substring(0, matchIndex).split('\n').length;
      const line = lines[lineNumber - 1].trim();
      
      errors.push({
        file: filePath,
        line: lineNumber,
        pattern: patternIndex,
        content: line,
      });
      hasErrors = true;
    }
  });
}

/**
 * Recursively find all HTML files in the src directory
 */
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (shouldExcludeDir(filePath)) {
      return;
    }
    
    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith(HTML_EXT)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Main function
 */
function main() {
  const srcDir = path.join(process.cwd(), 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.error('❌ src directory not found');
    process.exit(1);
  }
  
  console.log('🔍 Checking for inline styles in HTML templates...\n');
  
  const htmlFiles = findHtmlFiles(srcDir);
  
  if (htmlFiles.length === 0) {
    console.log('✅ No HTML files found to check');
    return;
  }
  
  htmlFiles.forEach(file => {
    checkFile(file);
  });
  
  if (hasErrors) {
    console.error('❌ Found inline styles. Please use Tailwind CSS classes instead:\n');
    
    errors.forEach(error => {
      const relativePath = path.relative(process.cwd(), error.file);
      const patternName = ['style="..."', '[style]', '[style.property]'][error.pattern];
      console.error(`  ${relativePath}:${error.line}`);
      console.error(`    Pattern: ${patternName}`);
      console.error(`    Content: ${error.content}\n`);
    });
    
    console.error('💡 Tip: Replace inline styles with Tailwind CSS utility classes.');
    console.error('   Example: style="color: red;" → class="text-red-500"\n');
    
    process.exit(1);
  } else {
    console.log(`✅ All ${htmlFiles.length} HTML files are using Tailwind CSS correctly!\n`);
  }
}

main();

