import MultiDropdown from './Dropdown.jsx';

function Categorization({
                            resourceTypes,
                            keywords,
                            topics,
                            targetGroups,
                            ageGroups,
                            selectedResourceTypes,
                            selectedKeywords,
                            selectedTopics,
                            selectedTargetGroups,
                            selectedAgeGroups,
                            setSelectedResourceTypes,
                            setSelectedKeywords,
                            setSelectedTopics,
                            setSelectedTargetGroups,
                            setSelectedAgeGroups,
                        }) {
    return (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Categorization</h3>
            <div className="grid md:grid-cols-2 gap-6">
                <MultiDropdown
                    label="Resource Types"
                    options={resourceTypes}
                    selectedValues={selectedResourceTypes}
                    onChange={setSelectedResourceTypes}
                />
                <MultiDropdown
                    label="Keywords"
                    options={keywords}
                    selectedValues={selectedKeywords}
                    onChange={setSelectedKeywords}
                />
                <MultiDropdown
                    label="Topics"
                    options={topics}
                    selectedValues={selectedTopics}
                    onChange={setSelectedTopics}
                />
                <MultiDropdown
                    label="Target User Groups"
                    options={targetGroups}
                    selectedValues={selectedTargetGroups}
                    onChange={setSelectedTargetGroups}
                />
                <MultiDropdown
                    label="Age Groups"
                    options={ageGroups}
                    selectedValues={selectedAgeGroups}
                    onChange={setSelectedAgeGroups}
                />
            </div>
        </div>
    );
}

export default Categorization;