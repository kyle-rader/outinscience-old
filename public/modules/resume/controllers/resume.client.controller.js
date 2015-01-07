'use strict';

angular.module('resume').controller('ResumeController', ['$scope',
	function($scope) {
		$scope.schools = [
			{
				'name':'Western Washington University',
				'degree':'B.S. Computer Science',
				'minors':['Math', 'Embedded Systems Engineering'],
				'graduated':'June, 2014',
				'gpa':'3.49',
				'complete':true
			},
			{
				'name':'Western Washington University',
				'degree':'M.S. Computer Science',
				'graduated':'March, 2016',
				'gpa':'4.0',
				'complete':false
			}];

		$scope.jobs = [
			{
				'company':'Code Lily',
				'title':'Co-Founder',
				'location':'Bellingham, WA',
				'dates':'Nov 2014 - Present',
				'info':[
					'We are building a computer science and web development education service (A coding bootcamp).',
					'We believe employees who feel undervalued and kids preparing for college all need access to great computer science education.'
				]
			},
			{
				'company':'Western Washington University',
				'title':'Graduate Teaching Assistant',
				'location':'Bellingham, WA',
				'dates':'Sept 2014 - Present',
				'info':[
					'Plan, run, critique and grade labs and homework.',
					'Intro to Robotics, Computer Programming I & II, Functional Programming and Formal Language and Automata Theory'
				]
			},
			{
				'company':'Uzility',
				'title':'Director of Engineering',
				'location':'Bellingham, WA',
				'dates':'Dec 2013 - Nov 2013',
				'info':[
					'Developed an agile software development management solution (software as a service).',
					'Practiced lean start-up methodology and agile software development (SCRUM).',
					'Worked in HTML, CSS/LESS, JavaScript, PHP, MySQL.'
				]
			},
			{
				'company':'Western Washington University',
				'title':'Undergraduate Teaching Assistant',
				'location':'Bellingham, WA',
				'dates':'Sept 2011 - June 2014'
			},
			{
				'company':'Brer Technical Inc.',
				'title':'Lead Software Engineer',
				'location':'Bellingham, WA',
				'dates':'June 2012 - March 2014',
				'info':[
					'Develop .NET API’s for hardware communication with motor controllers and mega-ohm meters via serial ports.',
					'Principal architect for a business management system centered on our MFI test procedure.',
					'Designed and implemented event based testing interface with real time data collection and visualization.'
				]
			},
			{
				'company':'Logos Research Systems',
				'title':'Software Developer',
				'location':'Bellingham, WA',
				'dates':'June 2013 - Jan 2014',
				'info':[
					'Developed and maintained an internal Ruby on Rails site housing database and server management tools.',
					'Tools include RabbitMQ message replay, MySQL cluster dashboard, server patch dashboard and schema migration dashboard.'
				]
			},
			{
				'company':'Western Washington University',
				'title':'Undergraduate Research Assistant',
				'location':'Bellingham, WA',
				'dates':'Sept 2011 - June 2013',
				'info':[
					'Data processing, GUI design and algorithm implementation in Matlab.'
				]
			},
			{
				'company':'Wing-It Productions',
				'title':'Stunt Actor',
				'location':'Seattle, WA',
				'dates':'June 2010 - July 2010',
				'info':[
					'Live stunt performances utilizing gymnastics, martial arts, and parkour.'
				]
			},
			{
				'company':'Hwang\'s TaeKwonDo',
				'title':'Instructor',
				'location':'Redmond, WA',
				'dates':'Sept 2006 - Sept 2009',
				'info':[
					'Earned my black belt in Jan, 2006.',
					'Taught children ages 4-7 TaeKwonDo.'
				]
			}
		];

		$scope.awards = [
			{
				'name':'WWU Computer Science Citizenship Award',
				'date':'June, 2014'
			},
			{
				'name':'Technology Alliance Group (NW): Technology Leader of Tomorrow',
				'date':'Dec, 2013'
			},
			{
				'name':'WWU Computer Science Citizenship Scholarship',
				'date':'Sept, 2013'
			},
			{
				'name':'Logos Bible Software Scholarship',
				'date':'Sept, 2012'
			},
			{
				'name':'Dealer Information Systems Scholarship',
				'date':'Sept, 2011'
			}
		];

		$scope.activities = [
			{
				'name':'WWU ACM: Director of Activities',
				'date':'March 2013 - Present'
			},
			{
				'name':'WWU ACM Mentor',
				'date':'March, 2013 - June 2013'
			},
			{
				'name':'WWU Robotics Club: President',
				'date':'Sept, 2010 - June 2012'
			},
			{
				'name':'CCDC/ Cyber Defense Club',
				'date':'Sept, 2012 - June, 2013'
			},
			{
				'name':'WWU IEEE: Vice Chair',
				'date':'Sept, 2011 - June, 2012'
			},
			{
				'name':'Bellingham A.I. and Robotics Society: Jr. Supervisor',
				'date':'Jan, 2011 - Jan, 2013'
			},
			{
				'name':'Associated Students Inter Club Council: Academic Representative',
				'date':'Sept, 2010 - June, 2011'
			}
		];
	}
]);