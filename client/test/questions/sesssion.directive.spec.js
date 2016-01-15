describe('Directive: SessionDir', function() {
    var directiveElem, scope, compile, defaultData;
    var validTemplate = '<session-dir></session-dir>';

    function createDirective(data, template) {
        var elm;
        scope.data = data || defaultData;
        elm = compile(template || validTemplate)(scope);

        return elm;
    }


    beforeEach(function() {
        module('wakeupApp', 'wakeupTemplates');

        inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            compile = $compile;
        });
        directiveElem = createDirective();
        scope.$digest();
    });

    describe('when created, it', function() {
        it('should have applied template', function() {
            expect(directiveElem.html()).not.toEqual('');
        });
        it('should have expected template elements', function() {
            var practiceSessionBtn = directiveElem.find('button').first();
            var sessionConfigurationBlock = directiveElem.find('div').first();

            expect(practiceSessionBtn.text()).toEqual('Practice Question Set');
            expect(practiceSessionBtn.attr('ng-click')).toBeDefined();

            expect(sessionConfigurationBlock.attr('ng-show')).toBeDefined();
            expect(sessionConfigurationBlock.find('form').length).toBe(1);

            expect(sessionConfigurationBlock.find('input[type="number"]').length).toBe(1);
            expect(sessionConfigurationBlock.find('input[type="checkbox"]').length).toBe(2);

            expect(sessionConfigurationBlock.find('button').length).toBe(2);
            expect(sessionConfigurationBlock.find('button[type="submit"]').attr('ng-click')).toBeDefined();
        });
    });

});