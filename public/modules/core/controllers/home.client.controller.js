'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location', '$http',
	function($scope, Authentication, $location, $http) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.fields = {
			'biology': 'Biology',
			'astronomy': 'Astronomy',
			'vehicleDesign': 'Vehicle Design',
			'scienceEducation': 'Science Education',
			'plasticsComposites': 'Plastics Composites',
			'physics': 'Physics',
			'neuroscience': 'Neuroscience',
			'math': 'Mathematics',
			'materialScience': 'Material Science',
			'manufacturingEngineering': 'Manufacturing Engineering',
			'industrialDesign': 'Industrial Design',
			'environmentalScience': 'Environmental Science',
			'electricalEngineering': 'Electrical Engineering',
			'computerScience': 'Computer Science',
			'chemistry': 'Chemistry',
			'geology': 'Geology'
		}
	}
]);
