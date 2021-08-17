import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './App.css'
import InfoBox from './InfoBox';
import LineGraph from './LineGraph';
import Table from './Table'
import { sortData } from './util';

const App = () => {

	const [countries, setCountries] = useState([])
	const [country, setCountry] = useState("worldwide")
	const [countryInfo, setCountryInfo] = useState({})
	const [tableData, setTableData] = useState([])

	useEffect(() => {
		fetch("https://disease.sh/v3/covid-19/all").then(res => res.json()).then(data => {
			setCountryInfo(data)
		})
	}, [])

	useEffect(() => {
		const getCountriesData = async () => {
			await fetch("https://disease.sh/v3/covid-19/countries")
				.then((response) => response.json())
				.then((data) => {
					const countries = data.map((country) => ({
						name: country.country,
						value: country.countryInfo.iso2
					}))

					const sortedData = sortData(data)
					setTableData(sortedData);
					setCountries(countries)
				})
		}
		getCountriesData();
	}, [])

	const onCountryChange = async (event) => {
		const countryCode = event.target.value

		setCountry(countryCode)

		const url =
			countryCode === 'worldwide'
				? 'https://disease.sh/v3/covid-19/all'
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`

		await fetch(url)
			.then(res => res.json())
			.then(data => {
				setCountry(countryCode)
				setCountryInfo(data);
			})
	}

	return (
		<>
			<div className="app">
				<div className="app__left">
					<div className="app__header">
						<h1>COVID-19 TRACKER</h1>
						<FormControl className="app__dropdown">
							<Select
								variant="outlined"
								value={country}
								onChange={onCountryChange}>
								<MenuItem value="worldwide">Worldwide</MenuItem>
								{
									countries.map((country) => (
										<MenuItem value={country.value}>{country.name}</MenuItem>
									))
								}
							</Select>
						</FormControl>
					</div>

					<div className="app__stats">
						<InfoBox title="Coronavirus cases" total={countryInfo.cases} cases={countryInfo.todayCases} />
						<InfoBox title="Recovered" total={countryInfo.recovered} cases={countryInfo.todayRecovered} />
						<InfoBox title="Deaths" total={countryInfo.deaths} cases={countryInfo.todayDeaths} />
					</div>
					<LineGraph />
				</div>

				<Card className="app__right">
					<CardContent>
						<div className="app__information">
							<h3>Live Cases by country</h3>
							<Table countries={tableData} />
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	)
}

export default App;