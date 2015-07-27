(function () {


Votr.MojePredmetyColumns = [
  [<abbr title="Semester">Sem.</abbr>, 'semester', null, true],
  ["Názov predmetu", 'nazov'],
  ["Skratka predmetu", 'skratka'],
  ["Kredit", 'kredit', Votr.sortAs.number],
  ["Typ výučby", 'typ_vyucby'],
  ["Hodnotenie", 'hodn_znamka'],
  ["Dátum hodnotenia", 'hodn_datum', Votr.sortAs.date],
  ["Termín hodnotenia", 'hodn_termin']
];
Votr.MojePredmetyColumns.defaultOrder = 'd0a1';


Votr.MojePredmetyPageContent = React.createClass({
  propTypes: {
    query: React.PropTypes.object.isRequired
  },

  renderContent: function () {
    var cache = new Votr.CacheRequester();
    var {zapisnyListKey} = this.props.query;
    var [hodnotenia, message] = cache.get('get_hodnotenia', zapisnyListKey) || [];

    if (!hodnotenia) {
      return <Votr.Loading requests={cache.missing} />;
    }

    var [hodnotenia, header] = Votr.sortTable(
      hodnotenia, Votr.MojePredmetyColumns, this.props.query, 'predmetySort');

    var stats = Votr.coursesStats(hodnotenia);

    return <table className="table table-condensed table-bordered table-striped table-hover">
      <thead>{header}</thead>
      <tbody>
        {hodnotenia.map((hodnotenie) =>
          <tr key={hodnotenie.hodn_key} className={Votr.classForSemester(hodnotenie.semester)}>
            <td>{hodnotenie.semester}</td>
            <td><Votr.Link href={_.assign({}, this.props.query, { modal: 'detailPredmetu', modalPredmetKey: hodnotenie.predmet_key, modalAkademickyRok: hodnotenie.akademicky_rok})}>
              {hodnotenie.nazov}
            </Votr.Link></td>
            <td>{hodnotenie.skratka}</td>
            <td>{hodnotenie.kredit}</td>
            <td>{Votr.humanizeTypVyucby(hodnotenie.typ_vyucby)}</td>
            <td>
              {hodnotenie.hodn_znamka}
              {hodnotenie.hodn_znamka ? " - " : null}
              {hodnotenie.hodn_znamka_popis}
            </td>
            <td>{hodnotenie.hodn_datum}</td>
            <td>{Votr.humanizeTerminHodnotenia(hodnotenie.hodn_termin)}</td>
          </tr>
        )}
      </tbody>
      <tfoot>
          <tr>
            <td colSpan="3">
              Celkom {stats.spolu.count} {Votr.plural(stats.spolu.count, "predmet", "predmety", "predmetov")}
              {" ("}{stats.zima.count} v zime, {stats.leto.count} v lete)
            </td>
            <td>{stats.spolu.creditsCount} ({stats.zima.creditsCount}+{stats.leto.creditsCount})</td>
            <td></td>
            <td>{Votr.renderWeightedStudyAverage(hodnotenia)}</td>
            <td></td>
            <td></td>
          </tr>
          {message && <tr><td colSpan={Votr.MojePredmetyColumns.length}>{message}</td></tr>}
      </tfoot>
    </table>;
  },

  render: function () {
    var {zapisnyListKey} = this.props.query;
    return <div>
      <div className="header">
        <Votr.PageTitle>Moje predmety</Votr.PageTitle>
      </div>
      {this.renderContent()}
    </div>;
  }
});


Votr.MojePredmetyPage = React.createClass({
  propTypes: {
    query: React.PropTypes.object.isRequired
  },

  render: function () {
    return <Votr.PageLayout query={this.props.query}>
      <Votr.ZapisnyListSelector query={this.props.query} component={Votr.MojePredmetyPageContent} />
    </Votr.PageLayout>;
  }
});


})();
